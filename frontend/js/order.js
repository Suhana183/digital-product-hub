// ===============================
// My Orders
// ===============================

const ORDERS_API = "/api/v1/orders";
const ordersContainer = document.getElementById("orders-container");

async function fetchOrders() {
    try {
        if (!ordersContainer) return;

        const token = localStorage.getItem("token");
        if (!token) {
            ordersContainer.innerHTML = `
                <div class="empty-cart">
                    <h2>Please login first</h2>
                    <a href="login.html">
                        <button class="buy-btn">Login</button>
                    </a>
                </div>
            `;
            return;
        }

        const response = await fetch(ORDERS_API, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        const orders = data.orders || data;
        displayOrders(orders);
    } catch (error) {
        console.error("Order Error:", error);
        ordersContainer.innerHTML = `<h3>Unable to load orders</h3>`;
    }
}

function displayOrders(orders) {
    if (!orders || orders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="empty-cart">
                <h2>No Orders Found</h2>
                <a href="index.html">
                    <button class="buy-btn">Buy Products</button>
                </a>
            </div>
        `;
        return;
    }

    ordersContainer.innerHTML = orders
        .map((order) => {
            const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });

            return `
                <div class="order-card">
                    <div class="order-card-header">
                        <div>
                            <h3>Order #${order._id.slice(-6)}</h3>
                            <p class="order-date">${orderDate}</p>
                        </div>
                        <span class="order-status">${order.paymentStatus || "Pending"}</span>
                    </div>

                    <div class="order-summary">
                        <p><strong>Total:</strong> ₹${order.totalAmount}</p>
                    </div>

                    <div class="ordered-products">
                        ${order.products
                            .map((item) => {
                                const product = item.product || {};
                                const productTitle = item.title || product.title || "Digital Product";
                                const productPrice = item.price || product.price || 0;
                                const productImage = product.image || item.image || "images/default-product.png";
                                const productId = product._id || item.product || item._id;
                                const hasDownload = order.paymentStatus === "Paid" && (product.fileUrl || item.fileUrl);

                                return `
                                    <div class="ordered-product">
                                        <img src="${productImage}" alt="${productTitle}">
                                        <div class="ordered-product-info">
                                            <h4>${productTitle}</h4>
                                            <p><strong>Price:</strong> ₹${productPrice}</p>
                                            <p><strong>Payment:</strong> ${order.paymentStatus || "Pending"}</p>
                                            <p><strong>Order Date:</strong> ${orderDate}</p>
                                            ${hasDownload
                                                ? `<button class="download-btn" onclick="downloadProduct('${productId}')">Download</button>`
                                                : `<button class="download-btn disabled" disabled>Payment Pending</button>`}
                                        </div>
                                    </div>
                                `;
                            })
                            .join("")}
                    </div>
                </div>
            `;
        })
        .join("");
}

async function downloadProduct(productId) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please login first");
        return;
    }

    const response = await fetch(`/api/v1/orders/download/${productId}`, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
        alert(data.message || "Unable to fetch download link.");
        return;
    }

    window.open(data.downloadUrl, "_blank");
}

fetchOrders();
