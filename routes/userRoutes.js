const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

// Protected Routes
router.get("/profile", protect, userController.getProfile);
router.put("/profile", protect, userController.updateProfile);

module.exports = router;
