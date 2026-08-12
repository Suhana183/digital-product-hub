const express = require("express");

const router = express.Router();


const {

    createOrder,

    getUserOrders,

    getOrderById,

    updateOrderStatus,

    markAsDownloaded,

    getSellerOrders,

    getDownloadLink

} = require("../controllers/orderController");



const { protect } =
require("../middleware/authMiddleware");




// ==========================================
// Create Order
// POST /api/v1/orders
// ==========================================

router.post(
    "/",
    protect,
    createOrder
);




// ==========================================
// Get Logged-in User Orders
// GET /api/v1/orders
// ==========================================

router.get(
    "/",
    protect,
    getUserOrders
);




// ==========================================
// Get Seller Orders
// GET /api/v1/orders/seller/orders
// ==========================================

router.get(
    "/seller/orders",
    protect,
    getSellerOrders
);




// ==========================================
// Get Download Link
// GET /api/v1/orders/download/:productId
// ==========================================

router.get(
    "/download/:productId",
    protect,
    getDownloadLink
);


// ==========================================
// Get Single Order
// GET /api/v1/orders/:id
// ==========================================

router.get(
    "/:id",
    protect,
    getOrderById
);




// ==========================================
// Update Order Status
// PUT /api/v1/orders/:id/status
// ==========================================

router.put(
    "/:id/status",
    protect,
    updateOrderStatus
);




// ==========================================
// Mark Product Downloaded
// PUT /api/v1/orders/:id/download
// ==========================================

router.put(
    "/:id/download",
    protect,
    markAsDownloaded
);




module.exports = router;