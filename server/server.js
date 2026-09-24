import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import categoriesRouter from "./routers/categories.js";
import subcategoriesRouter from "./routers/subcategories.js";
import adsRouter from "./routers/ads.js";
import authRouter from "./routers/auth.js";
import favoritRouter from "./routers/favorites.js";

const app = express();

app.use(
  cors({
    origin: "https://jardas32.github.io",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/categories", categoriesRouter);
app.use("/api/subcategories", subcategoriesRouter);
app.use("/api/ads", adsRouter);
app.use("/api/auth", authRouter);
app.use("/api/favorites", favoritRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Bazos API is working",
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});
