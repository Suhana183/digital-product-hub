// ============================================================
// DIGITAL PRODUCT HUB - BACKEND APP.JS
// ============================================================

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");

// ============================================================
// DNS FIX FOR MONGODB ATLAS
// ============================================================

dns.setServers([
    "8.8.8.8",
    "8.8.4.4",
    "1.1.1.1"
]);

// ============================================================
// APP
// ============================================================

const app = express();

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================
// STATIC FILES
// ============================================================

// If you have a public/uploads folder
app.use("/uploads", express.static("uploads"));

// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Digital Product Hub Backend is running 🚀",
        status: "OK"
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "API is working",
        database:
            mongoose.connection.readyState === 1
                ? "Connected"
                : "Disconnected"
    });
});

// ============================================================
// IMPORT ROUTES
// ============================================================

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// ============================================================
// API ROUTES
// ============================================================

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);

// ============================================================
// 404 ROUTE
// ============================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================

app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

// ============================================================
// MONGODB CONNECTION
// ============================================================

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("❌ MONGO_URI is missing in .env file");
    process.exit(1);
}

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected");

        // ========================================================
        // START SERVER ONLY AFTER DATABASE CONNECTION
        // ========================================================

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);

            console.log(
                `🌐 API: http://localhost:${PORT}/api/v1`
            );

            console.log(
                `📦 Products: http://localhost:${PORT}/api/v1/products`
            );

            console.log(
                `💳 Payment: http://localhost:${PORT}/api/v1/payment`
            );

            console.log(
                `📋 Orders: http://localhost:${PORT}/api/v1/orders`
            );

            console.log(
                `🔐 Auth: http://localhost:${PORT}/api/v1/auth`
            );

            console.log(
                process.env.RAZORPAY_KEY_ID
                    ? "💳 Razorpay: Configured"
                    : "⚠️ Razorpay: Not configured"
            );
        });
    })
    .catch((error) => {
        console.error("❌ MongoDB Connection Failed:");
        console.error(error.message);

        process.exit(1);
    });

// ============================================================
// MONGOOSE EVENTS
// ============================================================

mongoose.connection.on("disconnected", () => {
    console.log("⚠️ MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
    console.log("🔄 MongoDB reconnected");
});

// ============================================================
// PROCESS ERROR HANDLING
// ============================================================

process.on("unhandledRejection", (error) => {
    console.error("❌ Unhandled Promise Rejection:", error);
});

process.on("uncaughtException", (error) => {
    console.error("❌ Uncaught Exception:", error);
});