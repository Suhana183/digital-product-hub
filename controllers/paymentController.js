const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");

// ==========================================
// Razorpay Instance
// ==========================================

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


// ==========================================
// Create Razorpay Order
// POST /api/v1/payment/create-order
// ==========================================

exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        // Validate amount
        if (!amount || Number(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid amount"
            });
        }

        const options = {
            amount: Math.round(Number(amount) * 100),
            currency: "INR",
            receipt: "receipt_" + Date.now()
        };

        console.log("Creating Razorpay order:", options);

        const order = await razorpay.orders.create(options);

        return res.status(200).json({
            success: true,
            message: "Razorpay order created",
            order: order,
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error("Create Payment Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create Razorpay order"
        });
    }
};


// ==========================================
// Verify Razorpay Payment
// POST /api/v1/payment/verify
// ==========================================

exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            products,
            totalAmount
        } = req.body;

        // Validate payment data
        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Razorpay payment details are missing"
            });
        }

        // Validate products
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Products are missing"
            });
        }

        // Validate total amount
        if (!totalAmount || Number(totalAmount) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid total amount"
            });
        }

        // ==========================================
        // Generate Razorpay Signature
        // ==========================================

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                razorpay_order_id + "|" + razorpay_payment_id
            )
            .digest("hex");

        // ==========================================
        // Verify Signature
        // ==========================================

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });
        }

        // ==========================================
        // Prepare Products
        // ==========================================

        const orderProducts = products
            .map((item) => {

                const productId =
                    item._id ||
                    item.product?._id ||
                    item.product ||
                    null;

                return {
                    product: productId,

                    title:
                        item.title ||
                        item.product?.title ||
                        "Digital Product",

                    price:
                        Number(
                            item.price ||
                            item.product?.price ||
                            0
                        ),

                    quantity:
                        Number(item.quantity || 1),

                    fileUrl:
                        item.fileUrl ||
                        item.product?.fileUrl ||
                        ""
                };
            })
            .filter((item) => item.product);

        // Check products
        if (orderProducts.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order products are invalid"
            });
        }

        // ==========================================
        // Create Order in MongoDB
        // ==========================================

        const order = await Order.create({

            buyerId: req.user.id,

            products: orderProducts,

            totalAmount: Number(totalAmount),

            razorpayOrderId: razorpay_order_id,

            razorpayPaymentId: razorpay_payment_id,

            razorpaySignature: razorpay_signature,

            paymentMethod: "Razorpay",

            paymentStatus: "Paid",

            orderStatus: "Completed"
        });

        // ==========================================
        // Success Response
        // ==========================================

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            order
        });

    } catch (error) {

        console.error("Verify Payment Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Payment verification failed"
        });
    }
};


// ==========================================
// Get Razorpay Key
// GET /api/v1/payment/key
// ==========================================

exports.getRazorpayKey = async (req, res) => {
    try {

        if (!process.env.RAZORPAY_KEY_ID) {
            return res.status(500).json({
                success: false,
                message: "Razorpay key is not configured"
            });
        }

        return res.status(200).json({
            success: true,
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {

        console.error("Get Razorpay Key Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};