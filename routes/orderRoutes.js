import express from "express";
import fs from "fs";
const router = express.Router();

const orderFile = "./orders.json";

if (!fs.existsSync(orderFile)) fs.writeFileSync(orderFile, "[]");

function readOrders() {
  return JSON.parse(fs.readFileSync(orderFile));
}
function writeOrders(data) {
  fs.writeFileSync(orderFile, JSON.stringify(data, null, 2));
}

router.post("/", (req, res) => {
  const orders = readOrders();

  const newOrder = {
    id: Date.now(),
    ...req.body
  };

  orders.push(newOrder);
  writeOrders(orders);

  res.json({ success: true, message: "Order saved!" });
});

router.get("/", (req, res) => {
  res.json(readOrders());
});

export default router;
