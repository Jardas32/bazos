import dotenv from "dotenv";

dotenv.config({ path: "./server/.env" });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import categoriesRouter from "./routers/categories.js";
import subcategoriesRouter from "./routers/subcategories.js";
import adsRouter from "./routers/ads.js";
import authRouter from "./routers/auth.js";
import favoritRouter from "./routers/favorites.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =========================
// CORS
// =========================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://bazos-yihu.onrender.com",
    ],
    credentials: true,
  })
);

// =========================
// Middleware
// =========================

app.use(express.json());
app.use(cookieParser());

// =========================
// API
// =========================

app.use("/api/categories", categoriesRouter);
app.use("/api/subcategories", subcategoriesRouter);
app.use("/api/ads", adsRouter);
app.use("/api/auth", authRouter);
app.use("/api/favorites", favoritRouter);

// =========================
// React build
// =========================

const distPath = path.join(__dirname, "../dist");

app.use(express.static(distPath));

// =========================
// React Router
// =========================

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// =========================
// Server
// =========================

const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});