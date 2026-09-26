import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { db } from "../db.js";
import upload from "../middleware/upload.js";
import auth from "../middleware/auth.js";
import { v2 as cloudinary } from "cloudinary";

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

router.post(
  "/inzerat/add",
  auth,
  upload.array("image", 10),
  async (req, res) => {
    try {
      const { subcategory_id, title, description, price, city, postcod } =
        req.body;

      const userId = req.user.userId;

      if (!subcategory_id || !title || !description || !price || !userId) {
        return res.status(400).json({
          message:
            "Pole subcategory_id, title, description, price, city a postcod jsou povinná!",
        });
      }

      const [result] = await db.query(
        `INSERT INTO ads 
        (subcategory_id, title, description, price, city, postal_code, user_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [subcategory_id, title, description, price, city, postcod, userId]
      );

      const adId = result.insertId;

      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          await db.query(
            `INSERT INTO ad_images
            (ad_id, image_url, public_id)
            VALUES (?, ?, ?)`,
            [adId, file.path, file.filename]
          );
        }
      }

      return res.status(201).json({
        message: "Inzerát byl úspěšně přidán.",
        inzerat: {
          inzeratId: adId,
          title,
        },
      });
    } catch (err) {
      console.log("ADD AD ERROR:", err);

      return res.status(500).json({
        message: "Chyba serveru při přidávání inzerátu.",
      });
    }
  }
);

router.delete("/inzerat/delete/:id", auth, async (req, res) => {
  const { id } = req.params;

  // const token = req.cookies.token;

  // if (!token) {
  //   return res.status(401).json({
  //     message: "Nejste přihlášen.",
  //   });
  // }

  try {
    // const decode = jwt.verify(token, process.env.JWT_SECRET);

    const userId = req.use.userId;

    const [images] = await db.query(
      `
      SELECT public_id
      FROM ad_images
      WHERE ad_id = ?
      `,
      [id]
    );

    for (const img of images) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await db.query(
      `
      DELETE FROM ad_images
      WHERE ad_id = ?
      `,
      [id]
    );

    const [deletedAd] = await db.query(
      `
      DELETE FROM ads
      WHERE id = ?
      AND user_id = ?
      `,
      [id, userId]
    );

    if (deletedAd.affectedRows === 0) {
      return res.status(404).json({
        message: "Inzerát nebyl nalezen.",
      });
    }

    res.status(200).json({
      message: "Inzerát byl úspěšně odstraněn.",
      deletedId: id,
    });
  } catch (err) {
    console.error("DELETE ERROR:", err);

    res.status(500).json({
      message: "Chyba při mazání inzerátu.",
    });
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
