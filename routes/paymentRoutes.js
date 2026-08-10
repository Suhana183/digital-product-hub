const express = require("express");

const router = express.Router();


// ==========================================
// Controllers
// ==========================================

const {
    createOrder,
    verifyPayment,
    getRazorpayKey
} = require("../controllers/paymentController");


// ==========================================
// Authentication Middleware
// ==========================================

const {
    protect
} = require("../middleware/authMiddleware");


// ==========================================
// Create Razorpay Order
// POST /api/v1/payment/create-order
// ==========================================

router.post(
    "/create-order",
    protect,
    createOrder
);


// ==========================================
// Verify Razorpay Payment
// POST /api/v1/payment/verify
// ==========================================

router.post(
    "/verify",
    protect,
    verifyPayment
);


// ==========================================
// Get Razorpay Public Key
// GET /api/v1/payment/key
// ==========================================

router.get(
    "/key",
    getRazorpayKey
);


module.exports = router;