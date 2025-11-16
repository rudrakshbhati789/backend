import express from "express";
import fs from "fs";

const router = express.Router();
const reviewFile = "./reviews.json";

// Ensure file exists
if (!fs.existsSync(reviewFile)) fs.writeFileSync(reviewFile, "[]");

// Helpers
function readReviews() {
  return JSON.parse(fs.readFileSync(reviewFile));
}
function writeReviews(data) {
  fs.writeFileSync(reviewFile, JSON.stringify(data, null, 2));
}

/* ----------- ROUTES ----------- */

// GET all reviews
router.get("/", (req, res) => {
  res.json(readReviews());
});

// ADD review
router.post("/", (req, res) => {
  const reviews = readReviews();
  const newReview = {
    id: Date.now(),
    name: req.body.name,
    message: req.body.message,
    rating: req.body.rating,
    date: new Date().toLocaleDateString()
  };

  reviews.push(newReview);
  writeReviews(reviews);

  res.json({ success: true, review: newReview });
});

// DELETE review
router.delete("/:id", (req, res) => {
  let reviews = readReviews();
  reviews = reviews.filter(r => r.id != req.params.id);
  writeReviews(reviews);
  res.json({ success: true });
});

export default router;
