const Product = require("../models/Product");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("seller", "name email role")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, category, fileUrl, image, pricing } =
      req.body;

    if (
      !title ||
      !description ||
      price === undefined ||
      !category ||
      !fileUrl
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide title, description, price, category, and fileUrl",
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be zero or greater",
      });
    }

    const product = await Product.create({
      title,
      description,
      price: Number(price),
      category,
      fileUrl,
      image: image || "",
      pricing: pricing === "subscription" ? "subscription" : "one-time",
      seller: req.user.id,
    });

    const populatedProduct = await product.populate("seller", "name email role");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: populatedProduct,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this product",
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};
