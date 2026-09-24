import express from "express";
import { db } from "../db.js";

const router = express.Router();

router.get("/category/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const [subcategories] = await db.query(
      `SELECT subcategories.id, subcategories.name, subcategories.slug, categories.name AS category_name, categories.slug AS category_slug FROM subcategories INNER JOIN categories ON subcategories.categories_id = categories.id WHERE categories.slug = ? ORDER BY subcategories.name`,
      [slug]
    );

    res.json(subcategories);
  } catch (err) {
    console.log(err);
  }
});

export default router;
