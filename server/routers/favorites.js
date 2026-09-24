import express from "express";
import jwt from "jsonwebtoken";
import { db } from "../db.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      message: "Není ads_id",
    });
  }

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Nejste přihlášen",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Uživatel nebyl nalezen",
      });
    }

    await db.query(
      `INSERT INTO favorites (user_id, ad_id)
       VALUES (?, ?)`,
      [userId, id]
    );

    res.status(201).json({
      message: "Přidáno do oblíbených",
    });
  } catch (err) {
    console.log(err);

    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Neplatné přihlášení",
      });
    }

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Inzerát už je v oblíbených",
      });
    }

    res.status(500).json({
      message: "Chyba serveru",
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(401).json({ message: "Chybi Id" });
  }

  try {
    const [result] = await db.query(`DELETE FROM favorites WHERE ad_id = ?`, [
      id,
    ]);

    res.json({ message: "Úspěšně odstraněno" });
  } catch (err) {
    console.log(err);
  }
});

router.get("/my_favorites", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Nejste přihlášen",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.userId;

    const [result] = await db.query(
      `
      SELECT
        ads.id,
        ads.subcategory_id,
        ads.title,
        ads.description,
        ads.price,
        ads.city,
        ads.postal_code,
        ads.user_id,

        users.name AS seller_name,
        users.email AS seller_email,

        subcategories.name AS subcategory_name,
        subcategories.slug AS subcategory_slug,

        categories.name AS category_name,
        categories.slug AS category_slug,

        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', ad_images.id,
            'image_url', ad_images.image_url
          )
        ) AS images

      FROM favorites

      INNER JOIN ads
        ON favorites.ad_id = ads.id

      INNER JOIN users
        ON ads.user_id = users.id

      INNER JOIN subcategories
        ON ads.subcategory_id = subcategories.id

      INNER JOIN categories
        ON subcategories.categories_id = categories.id

      LEFT JOIN ad_images
        ON ad_images.ad_id = ads.id

      WHERE favorites.user_id = ?

      GROUP BY
        ads.id,
        ads.subcategory_id,
        ads.title,
        ads.description,
        ads.price,
        ads.city,
        ads.postal_code,
        ads.user_id,
        users.name,
        users.email,
        subcategories.name,
        subcategories.slug,
        categories.name,
        categories.slug

      ORDER BY favorites.id DESC
      `,
      [userId]
    );

    res.json(result);
  } catch (err) {
    console.error("MY FAVORITES ERROR:", err);

    res.status(500).json({
      message: "Chyba serveru",
    });
  }
});

export default router;
