require("dotenv").config();

const dns = require("dns");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Fix DNS lookup for MongoDB Atlas on Windows
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const app = express();

// =====================
// Middleware
// =====================
app.use(cors());
app.use(express.json());

// =====================
// Import Routes
// =====================
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const Product = require("./models/Product");
const User = require("./models/User");

// =====================
// Home Route
// =====================
app.get("/", (req, res) => {
    res.send("🚀 Digital Product Selling Platform API is Running...");
});

// =====================
// Health Check
// =====================
app.get("/health", (req, res) => {
    res.json({
        success: true,
        database:
            mongoose.connection.readyState === 1
                ? "Connected"
                : "Disconnected",
    });
});

// =====================
// API Routes
// =====================
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/payment", paymentRoutes);

// =====================
// MongoDB Connection
// =====================
const mongoUri =
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/digital_product_platform";

const mongoOptions = {
    serverSelectionTimeoutMS: 10000,
    family: 4,
    retryWrites: true,
};

const connectToDatabase = async () => {
    try {
        await mongoose.connect(mongoUri, mongoOptions);
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);

        if (/whitelist|IP that isn't/i.test(err.message)) {
            console.warn(
                "⚠️ Add your current IP in MongoDB Atlas → Network Access"
            );
        }

        console.warn(
            "⚠️ Falling back to MongoDB Memory Server (temporary database)"
        );

        try {
            const memoryServer = await MongoMemoryServer.create();
            const localUri = memoryServer.getUri();

            await mongoose.connect(localUri, mongoOptions);

            console.log("✅ Connected to MongoDB Memory Server");
        } catch (memoryErr) {
            console.error(
                "❌ MongoDB Memory Server Error:",
                memoryErr.message
            );
        }
    }
};

const seedProducts = async () => {
    try {
        let seller = await User.findOne({ role: "seller" });
        if (!seller) {
            seller = await User.create({
                name: "Default Seller",
                email: "seller@digitalproducthub.com",
                password: "seller12345",
                role: "seller",
            });
            console.log("👤 Created default seller for product seed");
        }

        const products = [
            {
                title: "React Course",
                description: "Complete React learning material with projects and notes.",
                price: 499,
                image: "react.png",
                fileUrl: "https://example.com/react-course.zip",
                pricing: "one-time",
                category: "Course",
            },
            {
                title: "Premium UI Kit",
                description: "A complete UI kit for startups and SaaS products.",
                price: 49,
                image: "Premium UI Kit.png",
                fileUrl: "https://example.com/ui-kit.zip",
                pricing: "one-time",
                category: "UI Kits",
            },
            {
                title: "JavaScript Master Guide",
                description: "Learn modern JavaScript from beginner to advanced.",
                price: 199,
                image: "ebook.png",
                fileUrl: "https://example.com/javascript-guide.pdf",
                pricing: "one-time",
                category: "E-books",
            },
            {
                title: "E-commerce Website Source Code",
                description: "Responsive shopping website source code with HTML, CSS and JavaScript.",
                price: 299,
                image: "sourcecode.png",
                fileUrl: "https://example.com/ecommerce-source.zip",
                pricing: "one-time",
                category: "Source Code",
            },
            {
                title: "Figma Dashboard Template",
                description: "High-converting admin dashboard template for modern apps.",
                price: 129,
                image: "Figma Dashboard Template.png",
                fileUrl: "https://example.com/dashboard-template.zip",
                pricing: "one-time",
                category: "Templates",
            },
            {
                title: "React Native Starter Pack",
                description: "Starter pack with reusable components and mobile UI screens.",
                price: 349,
                image: "React Native Starter Pack.png",
                fileUrl: "https://example.com/react-native-starter.zip",
                pricing: "one-time",
                category: "Mobile",
            },
        ];

        for (const product of products) {
            await Product.updateOne(
                { title: product.title },
                {
                    $set: {
                        ...product,
                        seller: seller._id,
                    },
                },
                { upsert: true }
            );
        }

        const seededCount = await Product.countDocuments();
        console.log(`🌱 Ensured ${seededCount} products are present in the catalog`);
    } catch (error) {
        console.error("❌ Product seeding failed:", error.message);
    }
};

const startServer = async () => {
    await connectToDatabase();
    await seedProducts();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
};

startServer();