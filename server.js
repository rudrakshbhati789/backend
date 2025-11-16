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
app.use("/uploads", express.static("uploads"));  // image upload folder
app.use(express.static("public"));               // admin dashboard folder

// CREATE JSON FILES IF THEY DON'T EXIST
const jsonFiles = ["products.json", "orders.json", "reviews.json"];

jsonFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "[]");
    console.log(`Created missing file: ${file}`);
  }
});

// USE ROUTES
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Param Sundari Backend Running ✔");
});

// FIXED PORT LOGGING
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("───────────────────────────────────────");
  console.log(" PARAM SUNDARI BACKEND STARTED SUCCESSFULLY ");
  console.log(" Your backend is running on: ");
  console.log(` 👉  http://localhost:${PORT}`);
  console.log("───────────────────────────────────────");
});
