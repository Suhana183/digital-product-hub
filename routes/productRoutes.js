const express = require("express");
const router = express.Router();

const {
  getProducts,
  createProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");

// Public Route
router.get("/", getProducts);

// Protected Routes
router.post("/", protect, createProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
