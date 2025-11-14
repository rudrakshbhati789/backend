import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import multer from "multer";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== DIRECTORIES =====
const rootDir = process.cwd();
const dataDir = path.join(rootDir, "data");
const uploadDir = path.join(rootDir, "uploads");

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

app.use("/uploads", express.static(uploadDir));

// ====== FILE PATHS ======
const productsFile = path.join(dataDir, "products.json");
const ordersFile = path.join(dataDir, "orders.json");
const reviewsFile = path.join(dataDir, "reviews.json");
const adminFile = path.join(dataDir, "admin.json");

// Create files if missing
for (const file of [productsFile, ordersFile, reviewsFile, adminFile]) {
  if (!fs.existsSync(file)) {
    if (file.includes("admin")) {
      fs.writeFileSync(file, JSON.stringify([{ username: "sweeta", password: "8839" }], null, 2));
    } else {
      fs.writeFileSync(file, "[]");
    }
  }
}

// ====== MULTER (for image upload) ======
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, ""))
});
const upload = multer({ storage });

// Utility functions
const getData = (file) => JSON.parse(fs.readFileSync(file));
const saveData = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// ===== ADMIN LOGIN =====
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  const admins = getData(adminFile);
  const match = admins.find(a => a.username === username && a.password === password);
  if (match) res.json({ success: true });
  else res.status(401).json({ success: false });
});

// ===== PRODUCTS =====
app.get("/api/products", (req, res) => {
  const products = getData(productsFile);
  res.json(products);
});

app.post("/api/products", upload.single("image"), (req, res) => {
  const products = getData(productsFile);
  const newProduct = {
    id: Date.now(),
    name: req.body.name,
    price: req.body.price,
    description: req.body.description || "",
    topSelling: req.body.topSelling === "true" || req.body.topSelling === true,
    image: "/uploads/" + req.file.filename
  };
  products.push(newProduct);
  saveData(productsFile, products);
  res.json({ success: true, product: newProduct });
});

app.delete("/api/products/:id", (req, res) => {
  const products = getData(productsFile);
  const updated = products.filter(p => p.id != req.params.id);
  saveData(productsFile, updated);
  res.json({ success: true });
});

app.patch("/api/products/:id/top", (req, res) => {
  const products = getData(productsFile);
  const product = products.find(p => p.id == req.params.id);
  if (!product) return res.status(404).json({ success: false });
  product.topSelling = !product.topSelling;
  saveData(productsFile, products);
  res.json({ success: true, topSelling: product.topSelling });
});

// ===== ORDERS =====
app.get("/api/orders", (req, res) => {
  const orders = getData(ordersFile);
  res.json(orders);
});

app.post("/api/orders", (req, res) => {
  const orders = getData(ordersFile);
  const newOrder = {
    id: Date.now(),
    name: req.body.name,
    phone: req.body.phone,
    city: req.body.city,
    pincode: req.body.pincode,
    address: req.body.address,
    total: req.body.total,
    cart: req.body.cart || [],
    date: new Date().toLocaleString()
  };
  orders.push(newOrder);
  saveData(ordersFile, orders);
  res.json({ success: true, order: newOrder });
});

app.delete("/api/orders/:id", (req, res) => {
  const orders = getData(ordersFile);
  const updated = orders.filter(o => o.id != req.params.id);
  saveData(ordersFile, updated);
  res.json({ success: true });
});

// ===== REVIEWS =====
app.get("/api/reviews", (req, res) => {
  const reviews = getData(reviewsFile);
  res.json(reviews);
});

app.post("/api/reviews", (req, res) => {
  const reviews = getData(reviewsFile);
  const newReview = {
    id: Date.now(),
    name: req.body.name,
    rating: req.body.rating,
    message: req.body.message
  };
  reviews.push(newReview);
  saveData(reviewsFile, reviews);
  res.json({ success: true });
});

// ===== SERVER =====
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
