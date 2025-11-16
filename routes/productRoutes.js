import express from "express";
import fs from "fs";
import multer from "multer";

const router = express.Router();
const productsFile = "./products.json";

// Ensure file exists
if (!fs.existsSync(productsFile)) fs.writeFileSync(productsFile, "[]");

// Helpers
function readProducts() {
  return JSON.parse(fs.readFileSync(productsFile));
}
function writeProducts(data) {
  fs.writeFileSync(productsFile, JSON.stringify(data, null, 2));
}

// Multer for image upload
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

/* ----------- ROUTES ----------- */

// GET all products
router.get("/", (req, res) => {
  const products = readProducts();
  res.json(products);
});

// ADD a product
router.post("/", upload.single("image"), (req, res) => {
  const products = readProducts();

  const newProduct = {
    id: Date.now(),
    name: req.body.name,
    price: req.body.price,
    description: req.body.description || "",
    size: req.body.size || "Free Size",
    topSelling: req.body.topSelling === "true",
    image: req.file ? `/uploads/${req.file.filename}` : ""
  };

  products.push(newProduct);
  writeProducts(products);

  res.json({ success: true, product: newProduct });
});

// DELETE product
router.delete("/:id", (req, res) => {
  let products = readProducts();
  products = products.filter(p => p.id != req.params.id);
  writeProducts(products);
  res.json({ success: true });
});

export default router;
