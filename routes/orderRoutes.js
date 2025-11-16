import express from "express";
import fs from "fs";

const router = express.Router();
const orderFile = "./orders.json";

// Ensure file exists
if (!fs.existsSync(orderFile)) fs.writeFileSync(orderFile, "[]");

// Helpers
function readOrders() {
  return JSON.parse(fs.readFileSync(orderFile));
}
function writeOrders(data) {
  fs.writeFileSync(orderFile, JSON.stringify(data, null, 2));
}

/* ----------- ROUTES ----------- */

// GET orders
router.get("/", (req, res) => {
  res.json(readOrders());
});

// ADD new order
router.post("/", (req, res) => {
  const orders = readOrders();

  const newOrder = {
    id: Date.now(),
    ...req.body,     // name, phone, address, cart items
    date: new Date().toLocaleString()
  };

  orders.push(newOrder);
  writeOrders(orders);

  res.json({ success: true, order: newOrder });
});

// DELETE order
router.delete("/:id", (req, res) => {
  let orders = readOrders();
  orders = orders.filter(o => o.id != req.params.id);
  writeOrders(orders);
  res.json({ success: true });
});

export default router;
