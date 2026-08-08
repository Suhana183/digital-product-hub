let products = [];

const API_BASE = "/api/v1/products";
const fallbackProducts = [
    {
        _id: "sample-react-course",
        title: "React Mastery Course",
        category: "Course",
        description: "Complete React learning material with projects and notes.",
        price: 499,
        image: "images/react.png",
        pricing: "one-time"
    },
    {
        _id: "sample-ui-kit",
        title: "Premium UI Kit",
        category: "UI Kit",
        description: "Professional Figma UI kit with 300+ components.",
        price: 49,
        image: "images/uikit.png",
        pricing: "one-time"
    },
    {
        _id: "sample-ebook",
        title: "JavaScript Master Guide",
        category: "E-book",
        description: "Learn modern JavaScript from beginner to advanced.",
        price: 199,
        image: "images/ebook.png",
        pricing: "one-time"
    },
    {
        _id: "sample-source-code",
        title: "E-commerce Website Source Code",
        category: "Source Code",
        description: "Complete responsive shopping website source code with HTML, CSS and JavaScript.",
        price: 299,
        image: "images/sourcecode.png",
        pricing: "one-time"
    }
];

function getImage(image) {
    if (!image || typeof image !== "string" || image.trim() === "") {
        return "/images/default-product.png";
    }

    const trimmed = image.trim();

    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }

    if (trimmed.startsWith("/")) {
        return trimmed;
    }

    if (trimmed.startsWith("images/")) {
        return `/${trimmed}`;
    }

    const fileName = trimmed.split(/[\\/]/).pop().toLowerCase();
    const directImageMap = {
        "react.png": "/images/react.png",
        "ebook.png": "/images/ebook.png",
        "sourcecode.png": "/images/sourcecode.png",
        "default-product.png": "/images/default-product.png",
        "premium ui kit.png": "/images/Premium%20UI%20Kit.png",
        "figma dashboard template.png": "/images/Figma%20Dashboard%20Template.png",
        "react native starter pack.png": "/images/React%20Native%20Starter%20Pack.png"
    };

    if (directImageMap[fileName]) {
        return directImageMap[fileName];
    }

    const normalized = trimmed.toLowerCase();
    const titleHint = normalized;
    if (titleHint.includes("premium ui") || titleHint.includes("ui kit") || titleHint.includes("kit")) {
        return "/images/Premium%20UI%20Kit.png";
    }
    if (titleHint.includes("figma") || titleHint.includes("dashboard")) {
        return "/images/Figma%20Dashboard%20Template.png";
    }
    if (titleHint.includes("react native")) {
        return "/images/React%20Native%20Starter%20Pack.png";
    }
    if (titleHint.includes("react")) {
        return "/images/react.png";
    }
    if (titleHint.includes("ebook") || titleHint.includes("book")) {
        return "/images/ebook.png";
    }
    if (titleHint.includes("source") || titleHint.includes("code")) {
        return "/images/sourcecode.png";
    }

    return `/images/${encodeURIComponent(trimmed)}`;
}

// ================= WISHLIST HELPERS =================
const getWishlist = () => {
    try {
        return JSON.parse(localStorage.getItem("wishlist")) || [];
    } catch (e) {
        return [];
    }
};

const saveWishlist = (list) => {
    localStorage.setItem("wishlist", JSON.stringify(list));
};

const toggleWishlistById = (id) => {
    const list = getWishlist();
    const idx = list.indexOf(id);
    if (idx === -1) list.push(id);
    else list.splice(idx, 1);
    saveWishlist(list);
    return list.includes(id);
};

// ================= FETCH PRODUCTS =================
const fetchProducts = async () => {
    const fetchError = document.getElementById("fetch-error");
    try {
        if (fetchError) fetchError.textContent = "Loading products...";
        const response = await fetch(API_BASE);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        const apiProducts = Array.isArray(data.products) ? data.products : [];
        products = apiProducts.length > 0 ? apiProducts : fallbackProducts;
        renderProducts();
        if (fetchError) fetchError.textContent = "";
    } catch (error) {
        console.error(error);
        products = fallbackProducts;
        renderProducts();
        if (fetchError) fetchError.textContent = "Showing all available products while the backend is unavailable.";
        const formMessage = document.getElementById("form-message");
        if (formMessage) formMessage.textContent = "Could not load products from backend.";
    }
};

// ================= CREATE / DELETE PRODUCT (admin) =================
const createProduct = async (payload) => {
    const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Create failed");
    const result = await response.json();
    const newProduct = result.product || result;
    products.unshift(newProduct);
    renderProducts();
    return newProduct;
};

const deleteProduct = async (id) => {
    const response = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Delete failed");
    products = products.filter((p) => p._id !== id);
    renderProducts();
};

// ================= DOM ELEMENTS =================
const productGrid = document.getElementById("product-grid");
const year = document.getElementById("year");
const listingForm = document.getElementById("listing-form");
const formMessage = document.getElementById("form-message");
const assetFile = document.getElementById("asset-file");
const uploadStatus = document.getElementById("upload-status");
const reviewButton = document.getElementById("review-btn");
const reviewPanel = document.getElementById("review-panel");
const reviewContent = document.getElementById("review-content");
const cartCount = document.getElementById("cart-count");

// ================= RENDER PRODUCTS =================
const renderProducts = () => {
    if (!productGrid) return;

    if (products.length === 0) {
        productGrid.innerHTML = `
        <article class="product-card empty-state">
            <h3>No products available</h3>
            <p>Add products from seller dashboard.</p>
        </article>`;
        return;
    }

    const wishlist = getWishlist();

    productGrid.innerHTML = products
        .map((product) => {
            const favorited = wishlist.includes(product._id);
            return `
        <article class="product-card">
            <img src="${getImage(product.image)}" class="product-image" alt="${product.title}" onerror="this.onerror=null;this.src='/images/default-product.png';">
            <div class="product-card-header">
                <span class="tag">${product.category}</span>
                <button class="delete-btn" data-id="${product._id}">Delete</button>
            </div>
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <div class="rating">⭐⭐⭐⭐⭐</div>
            <div class="product-meta">
                <span>${product.pricing === "subscription" ? "Subscription" : "Instant Download"}</span>
                <strong>₹${product.price}</strong>
            </div>
            <div class="product-buttons">
                <button class="cart-btn" data-id="${product._id}">Add to Cart</button>
                <button class="buy-btn" data-id="${product._id}">Buy Now</button>
                <button class="wishlist-btn" data-id="${product._id}" aria-label="Add to wishlist">
                    <i class="${favorited ? "fa-solid fa-heart" : "fa-regular fa-heart"}"></i>
                </button>
            </div>
        </article>`;
        })
        .join("");
};

// ================= CART FUNCTIONS =================
const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = cart.find((item) => item._id === product._id);
    if (exists) return alert("Product already added to cart");
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Product added to cart");
};

const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartCount) cartCount.textContent = cart.length;
};

// ================= PAGE YEAR =================
if (year) year.textContent = new Date().getFullYear();

// ================= EVENTS: DELETE / CART / BUY / WISHLIST =================
productGrid?.addEventListener("click", (event) => {
    const deleteBtn = event.target.closest(".delete-btn");
    if (deleteBtn) {
        deleteProduct(deleteBtn.dataset.id);
        return;
    }

    const cartBtn = event.target.closest(".cart-btn");
    if (cartBtn) {
        const product = products.find((p) => p._id === cartBtn.dataset.id);
        if (product) addToCart(product);
        return;
    }

    const buyBtn = event.target.closest(".buy-btn");
    if (buyBtn) {
        const product = products.find((p) => p._id === buyBtn.dataset.id);
        if (product) {
            localStorage.setItem("selectedProduct", JSON.stringify(product));
            window.location.href = "product-details.html";
        }
        return;
    }

    const wlBtn = event.target.closest('.wishlist-btn');
    if (wlBtn) {
        const id = wlBtn.dataset.id;
        if (!id) return;
        const nowFavorited = toggleWishlistById(id);
        const icon = wlBtn.querySelector('i');
        if (icon) icon.className = nowFavorited ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
    }
});

// ================= CREATE LISTING (admin) =================
if (listingForm) {
    listingForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = new FormData(listingForm);
        const productData = {
            title: data.get("title"),
            category: data.get("category"),
            description: data.get("description"),
            image: data.get("image"),
            fileUrl: data.get("image"),
            price: Number(data.get("price")),
            pricing: data.get("pricing"),
        };
        try {
            await createProduct(productData);
            if (formMessage) formMessage.textContent = "Product published successfully";
            listingForm.reset();
        } catch (error) {
            if (formMessage) formMessage.textContent = "Product creation failed";
        }
    });
}

// ================= FILE UPLOAD DISPLAY =================
if (assetFile && uploadStatus) {
    assetFile.addEventListener("change", () => {
        const file = assetFile.files[0];
        uploadStatus.textContent = file ? "Selected file : " + file.name : "No file selected";
    });
}

// ================= REVIEW BUTTON =================
if (reviewButton) {
    reviewButton.addEventListener("click", () => {
        const data = new FormData(listingForm);
        reviewPanel.hidden = false;
        reviewContent.innerHTML = `
    <h4>${data.get("title")}</h4>
    <p>Category: ${data.get("category")}</p>
    <p>Price: ₹${data.get("price")}</p>
    `;
    });
}

// ================= INITIALIZE APP =================
const initializeApp = () => {
    updateCartCount();
    fetchProducts();
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeApp);
} else {
    initializeApp();
}
