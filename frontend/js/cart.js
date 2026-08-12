// =============================================
// DIGITAL PRODUCT SELLING PLATFORM
// cart.js
// =============================================

// ================= HELPERS =================
function getImage(image) {
    if (!image || image.trim() === "") {
        return "images/default-product.png";
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
        return image;
    }

    if (image.startsWith("images/")) {
        return image;
    }

    return `images/${image}`;
}

// ================= ELEMENTS =================
const cartContainer = document.getElementById("cart-container");
const emptyCart = document.getElementById("empty-cart");
const totalPrice = document.getElementById("total-price");
const checkoutBtn = document.getElementById("checkout-btn");
const cartCount = document.getElementById("cart-count");

// ================= CART STORAGE =================
const loadCart = () => {
    return JSON.parse(localStorage.getItem("cart")) || [];
};

const saveCart = (cartItems) => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
};

const updateCartCount = (cartItems = loadCart()) => {
    const totalItems = cartItems.reduce(
        (sum, item) => sum + (item.quantity || 1),
        0
    );

    if (cartCount) {
        cartCount.textContent = totalItems;
    }
};

const getCartTotal = (cartItems = loadCart()) => {
    return cartItems.reduce(
        (sum, item) => sum + (Number(item.price || 0) * (item.quantity || 1)),
        0
    );
};

const renderCart = () => {
    if (!cartContainer || !emptyCart || !totalPrice || !checkoutBtn) {
        return;
    }

    const currentCart = loadCart();

    if (currentCart.length === 0) {
        cartContainer.innerHTML = "";
        emptyCart.hidden = false;
        totalPrice.textContent = "0";
        checkoutBtn.disabled = true;
        updateCartCount(currentCart);
        return;
    }

    emptyCart.hidden = true;
    checkoutBtn.disabled = false;

    cartContainer.innerHTML = currentCart.map(item => {
        const quantity = item.quantity || 1;
        const subtotal = Number(item.price || 0) * quantity;

        return `
            <article class="cart-card">
                <img
                    src="${getImage(item.image)}"
                    alt="${item.title}"
                    class="product-image"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='images/default-product.png';"
                >
                <div class="cart-item">
                    <h3>${item.title}</h3>
                    <p>${item.description || ""}</p>
                    <div class="product-meta">
                        <span>${item.pricing === "subscription" ? "Subscription" : "Instant Download"}</span>
                        <strong>₹${item.price}</strong>
                    </div>
                    <p>Quantity: ${quantity}</p>
                    <p>Subtotal: <strong>₹${subtotal.toFixed(2)}</strong></p>
                    <button class="remove-btn" data-id="${item._id}">Remove</button>
                </div>
            </article>
        `;
    }).join("");

    totalPrice.textContent = getCartTotal(currentCart).toFixed(2);
    updateCartCount(currentCart);
};

const removeFromCart = (id) => {
    const currentCart = loadCart();
    const updatedCart = currentCart.filter(item => item._id !== id);
    saveCart(updatedCart);
    renderCart();
};

if (cartContainer) {
    cartContainer.addEventListener("click", (event) => {
        const removeBtn = event.target.closest(".remove-btn");
        if (!removeBtn) {
            return;
        }

        removeFromCart(removeBtn.dataset.id);
    });
}

if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        
        const currentCart = loadCart();
        if (currentCart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        window.location.href = "checkout.html";
    });
}

updateCartCount();
renderCart();
