import express from "express";
import fs from "fs";
const router = express.Router();

const reviewFile = "./reviews.json";

if (!fs.existsSync(reviewFile)) fs.writeFileSync(reviewFile, "[]");

function readReviews() {
  return JSON.parse(fs.readFileSync(reviewFile));
}
function writeReviews(data) {
  fs.writeFileSync(reviewFile, JSON.stringify(data, null, 2));
}

router.post("/", (req, res) => {
  const reviews = readReviews();

  const newReview = {
    id: Date.now(),
    name: req.body.name,
    rating: req.body.rating,
    message: req.body.message
  };

  reviews.push(newReview);
  writeReviews(reviews);

  res.json({ success: true });
});

router.get("/", (req, res) => {
  res.json(readReviews());
});

export default router;
