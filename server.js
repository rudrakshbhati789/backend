import express from "express";
import cors from "cors";
import path from "path";

import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

app.listen(5000, () => console.log("Backend running on port 5000"));
