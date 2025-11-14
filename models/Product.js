import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  size: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Product", productSchema);
