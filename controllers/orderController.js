const Order = require("../models/Order");


// ==========================================
// Create Order
// ==========================================

exports.createOrder = async (req, res) => {

    try {


        const {
            products,
            totalAmount,
            paymentId,
            paymentStatus
        } = req.body;



        if (!Array.isArray(products) || products.length === 0 || !totalAmount) {
            return res.status(400).json({
                success: false,
                message: "Please provide products and total amount",
            });
        }

        const orderProducts = products
            .map((item) => {
                const productId =
                    item._id ||
                    (item.product && item.product._id) ||
                    item.product ||
                    null;

                return {
                    product: productId,
                    title: item.title || item.product?.title || "Digital Product",
                    price: Number(item.price || item.product?.price || 0),
                    quantity: Number(item.quantity || 1),
                    fileUrl: item.fileUrl || item.product?.fileUrl || item.image || "",
                };
            })
            .filter((item) => item.product);

        if (orderProducts.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order products are invalid",
            });
        }

        const order = await Order.create({
            buyerId: req.user.id,
            products: orderProducts,
            totalAmount: Number(totalAmount),
            razorpayPaymentId: paymentId || "",
            paymentStatus: paymentStatus || "Paid",
            orderStatus: paymentStatus === "Paid" ? "Completed" : "Processing",
        });


        res.status(201).json({

            success:true,

            message:"Order created successfully",

            order

        });



    }

    catch(error){


        console.error(error);


        res.status(500).json({

            success:false,

            message:error.message

        });


    }

};








// ==========================================
// Get Logged User Orders
// ==========================================


exports.getUserOrders = async(req,res)=>{


    try{


        const orders = await Order.find({

            buyerId:req.user.id

        })

        .populate({

            path:"products.product",

            select:"title image fileUrl price pricing"

        })

        .sort({

            createdAt:-1

        });






        res.status(200).json({

            success:true,

            count:orders.length,

            orders

        });



    }


    catch(error){


        console.error(error);


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};









// ==========================================
// Get Single Order
// ==========================================


exports.getOrderById = async(req,res)=>{


    try{


        const order = await Order.findById(
            req.params.id
        )

        .populate({

            path:"products.product",

            select:"title image fileUrl price pricing"

        })

        .populate(
            "buyerId",
            "name email"
        );




        if(!order){


            return res.status(404).json({

                success:false,

                message:"Order not found"

            });


        }





        res.json({

            success:true,

            order

        });



    }


    catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};








// ==========================================
// Update Order Status
// ==========================================


exports.updateOrderStatus = async(req,res)=>{


    try{


        const order =
        await Order.findByIdAndUpdate(

            req.params.id,

            {

                orderStatus:req.body.status

            },

            {

                new:true

            }

        );





        if(!order){


            return res.status(404).json({

                success:false,

                message:"Order not found"

            });


        }





        res.json({

            success:true,

            order

        });



    }


    catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};









// ==========================================
// Seller Orders
// ==========================================


exports.getSellerOrders = async(req,res)=>{


    try{


        const orders =
        await Order.find()

        .populate({

            path:"products.product",

            select:"title image fileUrl price pricing seller"

        })

        .populate(
            "buyerId",
            "name email"
        )

        .sort({

            createdAt:-1

        });

        const sellerOrders = orders
            .map((order) => {
                const filteredProducts = order.products.filter(
                    (item) =>
                        item.product &&
                        item.product.seller &&
                        item.product.seller.toString() === req.user.id
                );

                return {
                    ...order.toObject(),
                    products: filteredProducts,
                };
            })
            .filter((order) => order.products.length > 0);

        res.json({

            success:true,

            orders: sellerOrders

        });





        res.json({

            success:true,

            orders

        });



    }


    catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};
// ==========================================
// Mark Product as Downloaded
// ==========================================

exports.getDownloadLink = async (req, res) => {
    try {
        const productId = req.params.productId;

        const order = await Order.findOne({
            buyerId: req.user.id,
            paymentStatus: "Paid",
            "products.product": productId,
        }).populate("products.product", "title fileUrl");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "No purchased product found for download",
            });
        }

        const orderItem = order.products.find(
            (item) => item.product && item.product._id.toString() === productId
        );

        if (!orderItem || !orderItem.product.fileUrl) {
            return res.status(404).json({
                success: false,
                message: "Download link not available",
            });
        }

        res.status(200).json({
            success: true,
            downloadUrl: orderItem.product.fileUrl,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


exports.markAsDownloaded = async (req, res) => {

    try {


        const order =
        await Order.findByIdAndUpdate(

            req.params.id,

            {
                isDownloaded: true
            },

            {
                new: true
            }

        );



        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found"

            });

        }




        res.status(200).json({

            success: true,

            message: "Download status updated",

            order

        });



    } catch (error) {


        console.error(error);


        res.status(500).json({

            success: false,

            message: error.message

        });


    }

};