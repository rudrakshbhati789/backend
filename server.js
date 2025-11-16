import express from "express";
import cors from "cors";
import path from "path";
<<<<<<< HEAD
import fs from "fs";

// ROUTES
=======

>>>>>>> 9dd384e371295901bba4c9cc83451feb1bcd41d6
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

<<<<<<< HEAD
// STATIC FOLDERS
app.use("/uploads", express.static("uploads"));  // for images
app.use(express.static("public"));              // admin-dashboard.html

// CREATE JSON FILES IF MISSING
const files = ["products.json", "orders.json", "reviews.json"];
files.forEach(file => {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "[]");
});

// USE ROUTES
=======
app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));

>>>>>>> 9dd384e371295901bba4c9cc83451feb1bcd41d6
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

<<<<<<< HEAD
// DEFAULT ROUTE
app.get("/", (req, res) => {
  res.send("Param Sundari Backend Running ✔");
});

// START SERVER
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT} ✔`);
});
=======
app.listen(5000, () => console.log("Backend running on port 5000"));
>>>>>>> 9dd384e371295901bba4c9cc83451feb1bcd41d6
