import express from "express";
import cors from "cors";
import path from "path";
import multer from "multer";

const app = express();
app.use(cors());
app.use(express.json());

// IMPORTANT for Render
const __dirname = path.resolve();

// ============================
// 🔹 1. STATIC FILE SERVING
// ============================
app.use(express.static("public"));
app.use("/uploads", express.static("uploads")); // product images

// ============================
// 🔹 2. FILE UPLOAD SETUP
// ============================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// ============================
// 🔹 3. READ/WRITE JSON HELPERS
// ============================
function readJSON(file) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, file)));
}

function writeJSON(file, data) {
  fs.writeFileSync(path.join(__dirname, file), JSON.stringify(data, null, 2));
}

// ============================
// 🔹 4. API ROUTES
// ============================

// Get all products
app.get("/api/products", (req, res) => {
  const data = readJSON("products.json");
  res.json(data);
});

// Add product (admin)
app.post("/api/products", upload.single("image"), (req, res) => {
  const products = readJSON("products.json");

  const newProduct = {
    _id: Date.now().toString(),
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    topSelling: req.body.topSelling === "true",
    image: "/uploads/" + req.file.filename
  };

  products.push(newProduct);
  writeJSON("products.json", products);

  res.json({ message: "Product added", product: newProduct });
});

// Get orders
app.get("/api/orders", (req, res) => {
  const data = readJSON("orders.json");
  res.json(data);
});

// Add order
app.post("/api/orders", (req, res) => {
  const orders = readJSON("orders.json");

  const newOrder = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);
  writeJSON("orders.json", orders);

  res.json({ message: "Order placed", order: newOrder });
});

// Delete order
app.delete("/api/orders/:id", (req, res) => {
  let orders = readJSON("orders.json");
  orders = orders.filter(o => o.id != req.params.id);
  writeJSON("orders.json", orders);

  res.json({ message: "Order deleted" });
});

// Get reviews
app.get("/api/reviews", (req, res) => {
  const reviews = readJSON("reviews.json");
  res.json(reviews);
});

// Add review (admin)
app.post("/api/reviews", (req, res) => {
  const reviews = readJSON("reviews.json");

  const newReview = {
    id: Date.now(),
    name: req.body.name,
    rating: req.body.rating,
    message: req.body.message
  };

  reviews.push(newReview);
  writeJSON("reviews.json", reviews);

  res.json({ message: "Review added", review: newReview });
});

// ============================
// 🔹 5. DEFAULT ROUTE
// ============================
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

// ============================
// 🔹 6. START SERVER
// ============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
