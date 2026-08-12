// ============================================================
// DIGITAL PRODUCT HUB - BACKEND APP.JS
// ============================================================

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");
const path = require("path");
const fs = require("fs");

// ============================================================
// DNS FIX FOR MONGODB ATLAS
// ============================================================

dns.setServers([
    "8.8.8.8",
    "8.8.4.4",
    "1.1.1.1"
]);

// ============================================================
// CREATE EXPRESS APP
// ============================================================

const app = express();

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors({
    origin: "*",
    methods: [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS"
    ],
    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ]
}));

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// ============================================================
// STATIC FILES
// ============================================================

// Serve uploaded files
app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);

// ============================================================
// SERVE PRODUCT IMAGES
// ============================================================

const imagesPath =
    path.join(__dirname, "images");

console.log(
    "📁 Images directory:",
    imagesPath
);

console.log(
    "📁 Images directory exists:",
    fs.existsSync(imagesPath)
);

app.use(
    "/images",
    express.static(imagesPath, {
        extensions: [
            "png",
            "jpg",
            "jpeg",
            "webp"
        ]
    })
);

// ============================================================
// TEMPORARY IMAGE DIAGNOSTIC ROUTE
// ============================================================

app.get(
    "/debug-images",
    (req, res) => {

        if (
            !fs.existsSync(imagesPath)
        ) {

            return res.status(404).json({
                success: false,
                exists: false,
                message:
                    "images folder does NOT exist",
                imageDir:
                    imagesPath
            });
        }

        const files =
            fs.readdirSync(
                imagesPath
            );

        return res.json({
            success: true,
            exists: true,
            imageDir:
                imagesPath,
            count:
                files.length,
            files:
                files
        });
    }
);

// ============================================================
// DIRECT IMAGE TEST
// ============================================================

app.get(
    "/test-premium-image",
    (req, res) => {

        const imagePath =
            path.join(
                imagesPath,
                "Premium UI Kit.png"
            );

        if (
            !fs.existsSync(
                imagePath
            )
        ) {

            return res.status(404).json({
                success: false,
                message:
                    "Premium UI Kit.png not found",
                path:
                    imagePath
            });
        }

        res.sendFile(
            imagePath
        );
    }
);

// ============================================================
// BASIC TEST ROUTE
// ============================================================

app.get(
    "/",
    (req, res) => {

        res.json({
            success: true,
            message:
                "Digital Product Hub Backend is running"
        });
    }
);

// ============================================================
// HEALTH CHECK
// ============================================================

app.get(
    "/health",
    (req, res) => {

        res.json({
            success: true,
            status: "OK",
            message:
                "Server is healthy"
        });
    }
);

// ============================================================
// MONGODB CONNECTION
// ============================================================

const MONGO_URI =
    process.env.MONGO_URI;

if (!MONGO_URI) {

    console.error(
        "❌ MONGO_URI is not configured in environment variables."
    );

} else {

    mongoose
        .connect(MONGO_URI)
        .then(() => {

            console.log(
                "✅ MongoDB Connected"
            );

        })
        .catch((error) => {

            console.error(
                "❌ MongoDB Connection Error:"
            );

            console.error(
                error.message
            );
        });
}

// ============================================================
// API ROUTES
// ============================================================

// Products
try {

    const productRoutes =
        require(
            "./routes/productRoutes"
        );

    app.use(
        "/api/v1/products",
        productRoutes
    );

} catch (error) {

    console.log(
        "⚠️ Product routes could not be loaded:"
    );

    console.log(
        error.message
    );
}

// Authentication
try {

    const authRoutes =
        require(
            "./routes/authRoutes"
        );

    app.use(
        "/api/v1/auth",
        authRoutes
    );

} catch (error) {

    console.log(
        "⚠️ Auth routes could not be loaded:"
    );

    console.log(
        error.message
    );
}

// Orders
try {

    const orderRoutes =
        require(
            "./routes/orderRoutes"
        );

    app.use(
        "/api/v1/orders",
        orderRoutes
    );

} catch (error) {

    console.log(
        "⚠️ Order routes could not be loaded:"
    );

    console.log(
        error.message
    );
}

// Payment
try {

    const paymentRoutes =
        require(
            "./routes/paymentRoutes"
        );

    app.use(
        "/api/v1/payment",
        paymentRoutes
    );

} catch (error) {

    console.log(
        "⚠️ Payment routes could not be loaded:"
    );

    console.log(
        error.message
    );
}

// ============================================================
// 404 HANDLER
// ============================================================

app.use(
    (req, res) => {

        res.status(404).json({
            success: false,
            message:
                "Route not found",
            path:
                req.originalUrl
        });

    }
);

// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================

app.use(
    (err, req, res, next) => {

        console.error(
            "❌ Server Error:"
        );

        console.error(
            err
        );

        res.status(
            err.status || 500
        ).json({
            success: false,
            message:
                err.message ||
                "Internal Server Error"
        });

    }
);

// ============================================================
// SERVER START
// ============================================================

const PORT =
    process.env.PORT || 5000;

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            "=============================================="
        );

        console.log(
            "🚀 DIGITAL PRODUCT HUB BACKEND"
        );

        console.log(
            "=============================================="
        );

        console.log(
            `🚀 Server running on port ${PORT}`
        );

        console.log(
            `📁 Images folder: ${imagesPath}`
        );

        console.log(
            `🖼️ Image URL: /images/<filename>`
        );

        console.log(
            "=============================================="
        );

    }
);