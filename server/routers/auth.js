import "dotenv/config";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db.js";
import { sendNodemailer } from "../utils/nodemailer.js";

const router = express.Router();

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email a heslo jsou povinné",
    });
  }

  try {
    const [existingUser] = await db.query(
      `SELECT id FROM users WHERE email = ?`,
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        message: "Tento email již existuje",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO users (email, password, name) VALUES (?, ?, ?)`,
      [email, hashedPassword, name]
    );

    const token = jwt.sign(
      {
        userId: result.insertId,
        email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, cookieOptions);

    // await sendNodemailer(name, email);

    res.status(201).json({
      message: "Registrace byla úspěšná",
      user: {
        id: result.insertId,
        email,
        name,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Chyba serveru",
    });
  }
});

router.post("/login", async (req, res) => {
  const { emailLogin, passwordLogin } = req.body;

  if (!emailLogin || !passwordLogin) {
    return res.status(400).json({
      message: "Email a heslo jsou povinné",
    });
  }

  try {
    const [users] = await db.query(`SELECT * FROM users WHERE email = ?`, [
      emailLogin,
    ]);

    if (users.length === 0) {
      return res.status(401).json({
        message: "E-mail není registrován.",
      });
    }

    const user = users[0];

    const passwordCorrect = await bcrypt.compare(passwordLogin, user.password);

    if (!passwordCorrect) {
      return res.status(401).json({
        message: "Nesprávný email nebo heslo",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "Přihlášení bylo úspěšné",
      user: {
        userid: user.id,
        email: user.email,
        name: user.name,
      },
    });

    await sendNodemailer(user.name, user.email);
    
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Chyba serveru",
    });
  }
});

router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Nejste přihlášen",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [users] = await db.query(
      `SELECT id, email, name FROM users WHERE id = ?`,
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Uživatel neexistuje",
      });
    }

    res.json({
      user: users[0],
    });
  } catch (err) {
    console.log(err);

    res.status(401).json({
      message: "Neplatná nebo prošlá session",
    });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  res.json({
    message: "Byli jste odhlášeni",
  });
});

router.delete("/delete-acount", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Nejste přihlášen",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.userId;

    const [deleteUser] = await db.query(`DELETE FROM users WHERE id = ?`, [
      userId,
    ]);

    if (deleteUser.affectedRows === 0) {
      return res.status(404).json({
        message: "Uživatel neexistuje",
      });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    res.status(200).json({
      message: "Účet smazán",
      user: {
        id: userId,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(401).json({
      message: "Neplatná nebo prošlá session",
    });
  }
});

export default router;
