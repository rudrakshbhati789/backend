import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";
dotenv.config();

const sampleProducts = [
  {
    name: "Royal Black Kurta Set",
    price: 1999,
    description: "Elegant black kurta with golden embroidery — perfect for festive occasions.",
    image: "/uploads/black-kurta.jpg",
  },
  {
    name: "Golden Gown for Her",
    price: 2499,
    description: "Gorgeous golden gown with shimmering texture for the modern diva.",
    image: "/uploads/golden-gown.jpg",
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    await Product.deleteMany();
    await Product.insertMany(sampleProducts);
    console.log("✅ Sample products seeded!");
    process.exit();
  })
  .catch((err) => console.error(err));
