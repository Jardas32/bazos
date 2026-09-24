import express from "express";
import { db } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [categories] = await db.query(
      `SELECT id, name, slug FROM categories ORDER BY name`
    );

    res.json(categories);
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Error loading categories" });
  }
});

export default router;
