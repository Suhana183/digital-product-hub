const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({

    // Product Name
    title: {
        type: String,
        required: true,
        trim: true
    },


    // Product Category
    category: {
        type: String,
        default: "Uncategorized"
    },


    // Product Description
    description: {
        type: String,
        required: true
    },


    // Digital Product File URL
    // Example: AWS S3 / Google Drive / Cloud Storage URL
    fileUrl: {
        type: String,
        required: true
    },


    // Product Thumbnail Image
    image: {
        type: String,
        default: "images/default-product.png"
    },


    // Product Price
    price: {
        type: Number,
        default: 0
    },


    // Pricing Type
    pricing: {
        type: String,
        enum: [
            "one-time",
            "subscription"
        ],
        default: "one-time"
    },


    // Seller Information
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },


    // Download Count
    downloads: {
        type: Number,
        default: 0
    },


    // Product Status
    status: {
        type: String,
        enum: [
            "active",
            "inactive"
        ],
        default: "active"
    }


}, {

    timestamps: true

});



module.exports = mongoose.model(
    "Product",
    productSchema
);