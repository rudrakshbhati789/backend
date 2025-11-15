import express from "express";
import fs from "fs";
import multer from "multer";
const router = express.Router();

const productsFile = "./products.json";

// Ensure file exists
if (!fs.existsSync(productsFile)) fs.writeFileSync(productsFile, "[]");

function readProducts() {
  return JSON.parse(fs.readFileSync(productsFile));
}
function writeProducts(data) {
  fs.writeFileSync(productsFile, JSON.stringify(data, null, 2));
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// GET products
router.get("/", (req, res) => {
  res.json(readProducts());
});

// ADD product
router.post("/", upload.single("image"), (req, res) => {
  const products = readProducts();

  const newProduct = {
    id: Date.now(),
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    size: req.body.size,
    topSelling: req.body.topSelling === "true",
    image: req.file ? `/uploads/${req.file.filename}` : ""
  };

  products.push(newProduct);
  writeProducts(products);

  res.json({ success: true, product: newProduct });
});

export default router;
