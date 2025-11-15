import express from "express";
import cors from "cors";
import path from "path";
import multer from "multer";

import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// REQUIRED for Render
const __dirname = path.resolve();

// ==========================
// 1. STATIC FILES (ADMIN UI)
// ==========================
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==========================
// 2. FILE UPLOAD HANDLER
// ==========================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
export const upload = multer({ storage });

// ==========================
// 3. API ROUTES
// ==========================
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

// ==========================
// 4. ROOT ROUTE
// ==========================
app.get("/", (req, res) => {
  res.send("Backend running successfully 🚀");
});

// ==========================
// 5. SERVER LISTEN
// ==========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
