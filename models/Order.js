import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  city: String,
  pincode: String,
  items: Array,
  totalAmount: Number,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);
