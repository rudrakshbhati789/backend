import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";

// ROUTES
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// STATIC FOLDERS
app.use("/uploads", express.static("uploads"));  // for images
app.use(express.static("public"));              // admin-dashboard.html

// CREATE JSON FILES IF MISSING
const files = ["products.json", "orders.json", "reviews.json"];
files.forEach(file => {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "[]");
});

// USE ROUTES
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

// DEFAULT ROUTE
app.get("/", (req, res) => {
  res.send("Param Sundari Backend Running ✔");
});

// START SERVER
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT} ✔`);
});
