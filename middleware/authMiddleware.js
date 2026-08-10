const jwt = require("jsonwebtoken");
const User = require("../models/User");


// ==========================================
// Protect Route
// ==========================================

exports.protect = async (req, res, next) => {

    try {

        let token;


        // ==========================================
        // Get Authorization Header
        // ==========================================

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {

            token =
                req.headers.authorization
                    .split(" ")[1];
        }


        // ==========================================
        // Token Missing
        // ==========================================

        if (!token) {

            return res.status(401).json({
                success: false,
                message:
                    "Access denied. No token provided."
            });
        }


        // ==========================================
        // Verify Token
        // ==========================================

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // ==========================================
        // Find User
        // ==========================================

        const user =
            await User.findById(
                decoded.id
            ).select("-password");


        if (!user) {

            return res.status(401).json({
                success: false,
                message:
                    "User not found"
            });
        }


        // ==========================================
        // Attach User
        // ==========================================

        req.user = user;

        next();


    } catch (error) {

        console.error(
            "Auth Middleware Error:",
            error.message
        );

        return res.status(401).json({

            success: false,

            message:
                "Invalid or expired token"
        });
    }
};