// ==========================================
// LOAD ENVIRONMENT VARIABLES
// ==========================================

const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, ".env"),
    override: true
});


// ==========================================
// CHECK ENVIRONMENT VARIABLES
// ==========================================

console.log("");
console.log("==========================================");
console.log("🔧 Environment Check");
console.log("==========================================");

console.log(
    "MONGO_URI loaded:",
    process.env.MONGO_URI ? "YES" : "NO"
);

console.log(
    "JWT_SECRET loaded:",
    process.env.JWT_SECRET ? "YES" : "NO"
);

console.log(
    "RAZORPAY_KEY_ID loaded:",
    process.env.RAZORPAY_KEY_ID ? "YES" : "NO"
);

console.log("==========================================");
console.log("");


// ==========================================
// IMPORT PACKAGES
// ==========================================

const dns = require("dns");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


// ==========================================
// DNS SERVERS FOR MONGODB ATLAS
// ==========================================

dns.setServers([
    "8.8.8.8",
    "8.8.4.4",
    "1.1.1.1"
]);


// ==========================================
// EXPRESS APP
// ==========================================

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
    cors({
        origin: true,
        credentials: true
    })
);

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ==========================================
// IMPORT ROUTES
// ==========================================

const authRoutes =
    require("./routes/authRoutes");

const productRoutes =
    require("./routes/productRoutes");

const orderRoutes =
    require("./routes/orderRoutes");

const userRoutes =
    require("./routes/userRoutes");

const paymentRoutes =
    require("./routes/paymentRoutes");


// ==========================================
// IMPORT MODELS
// ==========================================

const Product =
    require("./models/Product");

const User =
    require("./models/User");


// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message:
            "🚀 Digital Product Selling Platform API is Running"
    });

});


// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/health", (req, res) => {

    res.status(200).json({

        success: true,

        database:
            mongoose.connection.readyState === 1
                ? "Connected"
                : "Disconnected",

        razorpay:
            process.env.RAZORPAY_KEY_ID
                ? "Configured"
                : "Not Configured"

    });

});


// ==========================================
// API ROUTES
// ==========================================

app.use(
    "/api/v1/auth",
    authRoutes
);

app.use(
    "/api/v1/products",
    productRoutes
);

app.use(
    "/api/v1/orders",
    orderRoutes
);

app.use(
    "/api/v1/users",
    userRoutes
);

app.use(
    "/api/v1/payment",
    paymentRoutes
);


// ==========================================
// MONGODB ATLAS CONNECTION
// ==========================================

const mongoUri = process.env.MONGO_URI;


// ==========================================
// CHECK MONGO_URI
// ==========================================

if (!mongoUri) {

    console.error("");
    console.error("==========================================");
    console.error("❌ MONGO_URI IS NOT FOUND");
    console.error("==========================================");
    console.error("");

    console.error(
        "Expected .env location:"
    );

    console.error(
        path.join(__dirname, ".env")
    );

    console.error("");

    console.error(
        "Your .env file must contain:"
    );

    console.error("");

    console.error(
        "MONGO_URI=mongodb+srv://..."
    );

    console.error("");

    process.exit(1);
}


// ==========================================
// MONGODB OPTIONS
// ==========================================

const mongoOptions = {

    serverSelectionTimeoutMS: 15000,

    family: 4,

    retryWrites: true

};


// ==========================================
// CONNECT TO MONGODB ATLAS
// ==========================================

const connectToDatabase = async () => {

    try {

        console.log(
            "🔄 Connecting to MongoDB Atlas..."
        );

        await mongoose.connect(
            mongoUri,
            mongoOptions
        );

        console.log("");
        console.log("==========================================");
        console.log("✅ MongoDB Atlas Connected Successfully");
        console.log("==========================================");
        console.log("");

    } catch (error) {

        console.error("");
        console.error("==========================================");
        console.error("❌ MongoDB Atlas Connection Failed");
        console.error("==========================================");
        console.error("");

        console.error(
            "Error:",
            error.message
        );

        console.error("");

        // IP / Network Access error
        if (
            /whitelist|IP that isn't|access list|not authorized/i
                .test(error.message)
        ) {

            console.error(
                "⚠️ Check MongoDB Atlas → Network Access."
            );

        }

        // Authentication error
        if (
            /authentication failed|bad auth|auth/i
                .test(error.message)
        ) {

            console.error(
                "⚠️ Check MongoDB Atlas username and password."
            );

        }

        // DNS / connection error
        if (
            /ENOTFOUND|querySrv|ECONNREFUSED|ETIMEOUT/i
                .test(error.message)
        ) {

            console.error(
                "⚠️ Check MongoDB Atlas connection string and DNS/network."
            );

        }

        console.error("");
        console.error(
            "❌ Server will NOT start without MongoDB Atlas."
        );
        console.error("");

        process.exit(1);
    }
};


// ==========================================
// SEED PRODUCTS
// ==========================================

const seedProducts = async () => {

    try {

        // ==========================================
        // FIND SELLER
        // ==========================================

        let seller =
            await User.findOne({
                role: "seller"
            });


        // ==========================================
        // CREATE DEFAULT SELLER
        // ==========================================

        if (!seller) {

            seller = await User.create({

                name:
                    "Default Seller",

                email:
                    "seller@digitalproducthub.com",

                password:
                    "seller12345",

                role:
                    "seller"

            });

            console.log(
                "👤 Created default seller"
            );

        } else {

            console.log(
                "👤 Default seller already exists"
            );

        }


        // ==========================================
        // PRODUCTS
        // ==========================================

        const products = [

            {
                title:
                    "React Course",

                description:
                    "Complete React learning material with projects and notes.",

                price:
                    499,

                image:
                    "react.png",

                fileUrl:
                    "https://example.com/react-course.zip",

                pricing:
                    "one-time",

                category:
                    "Course"
            },


            {
                title:
                    "Premium UI Kit",

                description:
                    "A complete UI kit for startups and SaaS products.",

                price:
                    49,

                image:
                    "Premium UI Kit.png",

                fileUrl:
                    "https://example.com/ui-kit.zip",

                pricing:
                    "one-time",

                category:
                    "UI Kits"
            },


            {
                title:
                    "JavaScript Master Guide",

                description:
                    "Learn modern JavaScript from beginner to advanced.",

                price:
                    199,

                image:
                    "ebook.png",

                fileUrl:
                    "https://example.com/javascript-guide.pdf",

                pricing:
                    "one-time",

                category:
                    "E-books"
            },


            {
                title:
                    "E-commerce Website Source Code",

                description:
                    "Responsive shopping website source code with HTML, CSS and JavaScript.",

                price:
                    299,

                image:
                    "sourcecode.png",

                fileUrl:
                    "https://example.com/ecommerce-source.zip",

                pricing:
                    "one-time",

                category:
                    "Source Code"
            },


            {
                title:
                    "Figma Dashboard Template",

                description:
                    "High-converting admin dashboard template for modern apps.",

                price:
                    129,

                image:
                    "Figma Dashboard Template.png",

                fileUrl:
                    "https://example.com/dashboard-template.zip",

                pricing:
                    "one-time",

                category:
                    "Templates"
            },


            {
                title:
                    "React Native Starter Pack",

                description:
                    "Starter pack with reusable components and mobile UI screens.",

                price:
                    349,

                image:
                    "React Native Starter Pack.png",

                fileUrl:
                    "https://example.com/react-native-starter.zip",

                pricing:
                    "one-time",

                category:
                    "Mobile"
            }

        ];


        // ==========================================
        // INSERT / UPDATE PRODUCTS
        // ==========================================

        for (
            const product of products
        ) {

            await Product.updateOne(

                {
                    title:
                        product.title
                },

                {
                    $set: {

                        ...product,

                        seller:
                            seller._id

                    }
                },

                {
                    upsert: true
                }

            );

        }


        // ==========================================
        // COUNT PRODUCTS
        // ==========================================

        const seededCount =
            await Product.countDocuments();


        console.log(
            `🌱 Ensured ${seededCount} products are present in the catalog`
        );


    } catch (error) {

        console.error(
            "❌ Product seeding failed:",
            error.message
        );

        throw error;
    }
};


// ==========================================
// START SERVER
// ==========================================

const startServer = async () => {

    try {

        // ==========================================
        // CONNECT TO MONGODB
        // ==========================================

        await connectToDatabase();


        // ==========================================
        // SEED PRODUCTS
        // ==========================================

        await seedProducts();


        // ==========================================
        // PORT
        // ==========================================

        const PORT =
            process.env.PORT || 5000;


        // ==========================================
        // START EXPRESS
        // ==========================================

        app.listen(
            PORT,
            () => {

                console.log("");
                console.log("==========================================");
                console.log(
                    `🚀 Server running on port ${PORT}`
                );
                console.log("==========================================");
                console.log("");

                console.log(
                    `💳 Razorpay: ${
                        process.env.RAZORPAY_KEY_ID
                            ? "Configured"
                            : "NOT CONFIGURED"
                    }`
                );

                console.log("");

            }
        );

    } catch (error) {

        console.error("");
        console.error(
            "❌ Server startup failed:",
            error.message || error
        );
        console.error("");

        process.exit(1);
    }
};


// ==========================================
// START APPLICATION
// ==========================================

startServer();