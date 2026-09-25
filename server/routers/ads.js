import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { db } from "../db.js";
import upload from "../middleware/upload.js";
// import { auth } from "../middleware/auth.js";

const router = express.Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(process.cwd(), "/uploads"));
//   },

//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}` + `${file.originalname}`;

//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage });

router.get("/category/:categorySlug", async (req, res) => {
  const { categorySlug } = req.params;

  if (!categorySlug) {
    return res.status(400).json({
      message: "categorySlug empty.",
    });
  }

  try {
    // Получаем объявления
    const [ads] = await db.query(
      `
      SELECT
        ads.id,
        ads.title,
        ads.description,
        ads.price,
        ads.city,
        ads.postal_code,
        ads.views,
        ads.created_at,

        users.name AS seller_name,

        subcategories.name AS subcategory_name,
        subcategories.slug AS subcategory_slug,

        categories.name AS category_name,
        categories.slug AS category_slug

      FROM ads

      INNER JOIN users
        ON ads.user_id = users.id

      INNER JOIN subcategories
        ON ads.subcategory_id = subcategories.id

      INNER JOIN categories
        ON subcategories.categories_id = categories.id

      WHERE categories.slug = ?

      ORDER BY ads.created_at DESC
      `,
      [categorySlug]
    );

    // Получаем все фотографии
    const [images] = await db.query(
      `
      SELECT
        id,
        ad_id,
        image_url
      FROM ad_images
      ORDER BY id ASC
      `
    );

    // Добавляем фотографии к соответствующим объявлениям
    const result = ads.map((ad) => ({
      ...ad,
      images: images.filter((image) => image.ad_id === ad.id),
    }));

    res.json(result);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error loading ads",
    });
  }
});

router.get("/subcategory/:subcategorySlug", async (req, res) => {
  const { subcategorySlug } = req.params;

  if (!subcategorySlug) {
    return res.status(400).json({
      message: "subcategorySlug empty.",
    });
  }

  try {
    // Получаем объявления
    const [ads] = await db.query(
      `
      SELECT
        ads.id,
        ads.title,
        ads.description,
        ads.price,
        ads.city,
        ads.postal_code,
        ads.views,
        ads.created_at,

        users.name AS seller_name,

        subcategories.name AS subcategory_name,
        subcategories.slug AS subcategory_slug,

        categories.name AS category_name,
        categories.slug AS category_slug

      FROM ads

      INNER JOIN users
        ON ads.user_id = users.id

      INNER JOIN subcategories
        ON ads.subcategory_id = subcategories.id

      INNER JOIN categories
        ON subcategories.categories_id = categories.id

      WHERE subcategories.slug = ?

      ORDER BY ads.created_at DESC
      `,
      [subcategorySlug]
    );

    // Получаем фотографии
    const [images] = await db.query(
      `
      SELECT
        id,
        ad_id,
        image_url
      FROM ad_images
      ORDER BY id ASC
      `
    );

    // Добавляем фотографии к объявлениям
    const result = ads.map((ad) => ({
      ...ad,
      images: images.filter((image) => image.ad_id === ad.id),
    }));

    res.json(result);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error loading ads",
    });
  }
});

router.post("/inzerat/add", upload.array("image", 10), async (req, res) => {
  const { subcategory_id, title, description, price, city, postcod, user_id } =
    req.body;

  const token = req.cookies.token;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const userId = decoded.userId;

  if (!subcategory_id || !title || !description || !price || !userId) {
    return res.status(401).json({
      message:
        "Pole subcategory_id, title, description, price, city, postcod a user_id jsou povinná!",
    });
  }

  const [result] = await db.query(
    `INSERT INTO ads (subcategory_id, title, description, price, city, postal_code, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [subcategory_id, title, description, price, city, postcod, userId]
  );

  const adId = result.insertId;

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      await db.query(
        `INSERT INTO ad_images
        (ad_id, image_url)
        VALUES (?,?)
        `,
        [adId, file.path]
      );
    }
  }

  res.json({
    message: "Inzerát byl úspěšně přidán.",
    inzerat: {
      inzeratId: result.insertId,
      title,
    },
  });

  try {
  } catch (err) {
    console.log(err);
  }
});

router.delete("/inzerat/delete/:id", async (req, res) => {
  const { id } = req.params;

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Nejste přihlášen." });
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET);

  const userId = decode.userId;

  try {
    const [deletedAd] = await db.query(
      `DELETE FROM ads
       WHERE id = ?
       AND user_id = ? `,
      [id, userId]
    );

    res
      .status(200)
      .json({ message: "Inzerát byl úspěšně odstraněn.", deletedId: id });
  } catch (err) {
    console.log(err);
  }
});

router.get("/inzerat/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "Empty title" });

  try {
    const [updateviews] = await db.query(
      `UPDATE ads 
       set views = views + 1
       WHERE ads.id = ?`,
      [id]
    );

    const [ads] = await db.query(
      `SELECT 
       ads.*,
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

       FROM ads

       INNER JOIN users ON ads.user_id = users.id

       INNER JOIN subcategories
       ON ads.subcategory_id = subcategories.id

       INNER JOIN categories
       ON subcategories.categories_id = categories.id

       LEFT JOIN ad_images ON ad_images.ad_id = ads.id

       WHERE ads.id = ?

        GROUP BY
        ads.id,
        ads.title,
        ads.description,
        ads.price,
        ads.city,
        ads.postal_code,
        ads.views,
        ads.created_at,
        users.name,
        subcategories.name,
        subcategories.slug,
        categories.name,
        categories.slug
       `,
      [id]
    );

    res.json(ads[0]);
  } catch (err) {
    console.log(err);
  }
});

router.get("/my_ads", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Chybí token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.userId;

    const [myads] = await db.query(
      `
      SELECT 
        ads.id,
        ads.title,
        ads.description,
        ads.price,
        ads.city,
        ads.postal_code,
        ads.views,
        ads.created_at,

        users.name AS seller_name,

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

      FROM ads

      INNER JOIN users 
        ON ads.user_id = users.id

      INNER JOIN subcategories
        ON ads.subcategory_id = subcategories.id

      INNER JOIN categories
        ON subcategories.categories_id = categories.id

      LEFT JOIN ad_images
        ON ad_images.ad_id = ads.id

      WHERE ads.user_id = ?

      GROUP BY
        ads.id,
        ads.title,
        ads.description,
        ads.price,
        ads.city,
        ads.postal_code,
        ads.views,
        ads.created_at,
        users.name,
        subcategories.name,
        subcategories.slug,
        categories.name,
        categories.slug

      ORDER BY ads.created_at DESC
      `,
      [userId]
    );

    res.json(myads);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Chyba při načítání mých inzerátů",
    });
  }
});

router.get("/allinzerat/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const [alladsuser] = await db.query(
      `SELECT 
       ads.*,
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

       FROM ads

       INNER JOIN users ON ads.user_id = users.id

       INNER JOIN subcategories
       ON ads.subcategory_id = subcategories.id

       INNER JOIN categories
       ON subcategories.categories_id = categories.id

       LEFT JOIN ad_images ON ad_images.ad_id = ads.id

       WHERE ads.user_id = ?

        GROUP BY
        ads.id,
        ads.title,
        ads.description,
        ads.price,
        ads.city,
        ads.postal_code,
        ads.views,
        ads.created_at,
        users.name,
        subcategories.name,
        subcategories.slug,
        categories.name,
        categories.slug

        ORDER BY ads.created_at DESC
    `,
      [user_id]
    );

    res.status(200).json(alladsuser);
  } catch (err) {
    console.log(err);

    res.status(401).json({ message: "Chyba serveru...!" });
  }
});

export default router;
