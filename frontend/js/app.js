// ======================================================
// DIGITAL PRODUCT HUB - APP.JS
// ======================================================

let products = [];

const API_BASE =
    "https://digital-product-hub-4.onrender.com/api/v1/products";

// ======================================================
// FALLBACK PRODUCTS
// ======================================================

const fallbackProducts = [
    {
        _id: "sample-react-course",
        title: "React Mastery Course",
        category: "Course",
        description:
            "Complete React learning material with projects and notes.",
        price: 499,
        image: "images/react.png",
        pricing: "one-time"
    },
    {
        _id: "sample-ui-kit",
        title: "Premium UI Kit",
        category: "UI Kit",
        description:
            "Professional Figma UI kit with 300+ components.",
        price: 49,
        image: "images/uikit.png",
        pricing: "one-time"
    },
    {
        _id: "sample-ebook",
        title: "JavaScript Master Guide",
        category: "E-book",
        description:
            "Learn modern JavaScript from beginner to advanced.",
        price: 199,
        image: "images/ebook.png",
        pricing: "one-time"
    },
    {
        _id: "sample-source-code",
        title: "E-commerce Website Source Code",
        category: "Source Code",
        description:
            "Complete responsive shopping website source code with HTML, CSS and JavaScript.",
        price: 299,
        image: "images/sourcecode.png",
        pricing: "one-time"
    }
];

// ======================================================
// IMAGE HELPER
// ======================================================

function getImage(image) {
    // No image
    if (
        !image ||
        typeof image !== "string" ||
        image.trim() === ""
    ) {
        return "/images/default-product.png";
    }

    const trimmed = image.trim();

    // Full URL
    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }

    // Already starts with /
    if (trimmed.startsWith("/")) {
        return trimmed;
    }

    // Already starts with images/
    if (trimmed.startsWith("images/")) {
        return `/${trimmed}`;
    }

    // Get only filename
    const fileName = trimmed
        .split(/[\\/]/)
        .pop()
        .toLowerCase();

    // ==================================================
    // IMAGE MAP
    // ==================================================

    const directImageMap = {
        "react.png":
            "/images/react.png",

        "ebook.png":
            "/images/ebook.png",

        "sourcecode.png":
            "/images/sourcecode.png",

        "uikit.png":
            "/images/uikit.png",

        "default-product.png":
            "/images/default-product.png",

        "premium ui kit.png":
            "/images/uikit.png",

        "figma dashboard template.png":
            "/images/Figma%20Dashboard%20Template.png",

        "react native starter pack.png":
            "/images/React%20Native%20Starter%20Pack.png"
    };

    // Exact filename match
    if (directImageMap[fileName]) {
        return directImageMap[fileName];
    }

    // ==================================================
    // TITLE / NAME BASED IMAGE MATCHING
    // ==================================================

    const normalized = trimmed.toLowerCase();

    // Premium UI Kit
    if (
        normalized.includes("premium ui") ||
        normalized.includes("ui kit") ||
        normalized.includes("uikit") ||
        normalized === "kit"
    ) {
        return "/images/uikit.png";
    }

    // Figma Dashboard
    if (
        normalized.includes("figma") ||
        normalized.includes("dashboard")
    ) {
        return "/images/Figma%20Dashboard%20Template.png";
    }

    // React Native
    if (
        normalized.includes("react native")
    ) {
        return "/images/React%20Native%20Starter%20Pack.png";
    }

    // React
    if (
        normalized.includes("react")
    ) {
        return "/images/react.png";
    }

    // E-book
    if (
        normalized.includes("ebook") ||
        normalized.includes("e-book") ||
        normalized.includes("book")
    ) {
        return "/images/ebook.png";
    }

    // Source code
    if (
        normalized.includes("source") ||
        normalized.includes("code")
    ) {
        return "/images/sourcecode.png";
    }

    // Final fallback
    return `/images/${encodeURIComponent(trimmed)}`;
}

// ======================================================
// WISHLIST HELPERS
// ======================================================

const getWishlist = () => {
    try {
        return (
            JSON.parse(
                localStorage.getItem("wishlist")
            ) || []
        );
    } catch (error) {
        console.error(
            "Wishlist error:",
            error
        );

        return [];
    }
};

const saveWishlist = (list) => {
    localStorage.setItem(
        "wishlist",
        JSON.stringify(list)
    );
};

const toggleWishlistById = (id) => {
    const list = getWishlist();

    const index = list.indexOf(id);

    if (index === -1) {
        list.push(id);
    } else {
        list.splice(index, 1);
    }

    saveWishlist(list);

    return list.includes(id);
};

// ======================================================
// FETCH PRODUCTS
// ======================================================

const fetchProducts = async () => {
    const fetchError =
        document.getElementById("fetch-error");

    try {
        if (fetchError) {
            fetchError.textContent =
                "Loading products...";
        }

        const response =
            await fetch(API_BASE);

        if (!response.ok) {
            throw new Error(
                `Failed to fetch products: ${response.status}`
            );
        }

        const data =
            await response.json();

        const apiProducts =
            Array.isArray(data.products)
                ? data.products
                : [];

        products =
            apiProducts.length > 0
                ? apiProducts
                : fallbackProducts;

        renderProducts();

        if (fetchError) {
            fetchError.textContent = "";
        }

    } catch (error) {
        console.error(
            "Product fetch error:",
            error
        );

        products = fallbackProducts;

        renderProducts();

        if (fetchError) {
            fetchError.textContent =
                "Showing available products while the backend is unavailable.";
        }

        const formMessage =
            document.getElementById(
                "form-message"
            );

        if (formMessage) {
            formMessage.textContent =
                "Could not load products from backend.";
        }
    }
};

// ======================================================
// CREATE PRODUCT
// ======================================================

const createProduct = async (payload) => {
    const response =
        await fetch(API_BASE, {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify(payload)
        });

    if (!response.ok) {
        const errorText =
            await response.text();

        throw new Error(
            errorText || "Create failed"
        );
    }

    const result =
        await response.json();

    const newProduct =
        result.product || result;

    products.unshift(newProduct);

    renderProducts();

    return newProduct;
};

// ======================================================
// DELETE PRODUCT
// ======================================================

const deleteProduct = async (id) => {
    try {
        const response =
            await fetch(
                `${API_BASE}/${id}`,
                {
                    method: "DELETE"
                }
            );

        if (!response.ok) {
            throw new Error(
                "Delete failed"
            );
        }

        products =
            products.filter(
                (product) =>
                    product._id !== id
            );

        renderProducts();

        alert(
            "Product deleted successfully"
        );

    } catch (error) {
        console.error(
            "Delete error:",
            error
        );

        alert(
            "Unable to delete product"
        );
    }
};

// ======================================================
// DOM ELEMENTS
// ======================================================

const productGrid =
    document.getElementById(
        "product-grid"
    );

const year =
    document.getElementById(
        "year"
    );

const listingForm =
    document.getElementById(
        "listing-form"
    );

const formMessage =
    document.getElementById(
        "form-message"
    );

const assetFile =
    document.getElementById(
        "asset-file"
    );

const uploadStatus =
    document.getElementById(
        "upload-status"
    );

const reviewButton =
    document.getElementById(
        "review-btn"
    );

const reviewPanel =
    document.getElementById(
        "review-panel"
    );

const reviewContent =
    document.getElementById(
        "review-content"
    );

const cartCount =
    document.getElementById(
        "cart-count"
    );

// ======================================================
// RENDER PRODUCTS
// ======================================================

const renderProducts = () => {
    if (!productGrid) {
        return;
    }

    // No products
    if (products.length === 0) {
        productGrid.innerHTML = `
            <article class="product-card empty-state">

                <h3>No products available</h3>

                <p>
                    Add products from seller dashboard.
                </p>

            </article>
        `;

        return;
    }

    const wishlist =
        getWishlist();

    productGrid.innerHTML =
        products
            .map((product) => {
                const favorited =
                    wishlist.includes(
                        product._id
                    );

                return `
                    <article
                        class="product-card"
                        data-product-id="${product._id}"
                    >

                        <img
                            src="${getImage(product.image)}"
                            class="product-image"
                            alt="${product.title || "Product"}"
                            loading="lazy"
                            onerror="
                                this.onerror=null;
                                this.src='/images/default-product.png';
                            "
                        >

                        <div class="product-card-header">

                            <span class="tag">
                                ${
                                    product.category ||
                                    "Uncategorized"
                                }
                            </span>

                            <button
                                type="button"
                                class="delete-btn"
                                data-id="${product._id}"
                            >
                                Delete
                            </button>

                        </div>

                        <h3>
                            ${
                                product.title ||
                                "Untitled Product"
                            }
                        </h3>

                        <p>
                            ${
                                product.description ||
                                "No description available."
                            }
                        </p>

                        <div class="rating">
                            ⭐⭐⭐⭐⭐
                        </div>

                        <div class="product-meta">

                            <span>
                                ${
                                    product.pricing ===
                                    "subscription"
                                        ? "Subscription"
                                        : "Instant Download"
                                }
                            </span>

                            <strong>
                                ₹${Number(
                                    product.price || 0
                                ).toLocaleString("en-IN")}
                            </strong>

                        </div>

                        <div class="product-buttons">

                            <button
                                type="button"
                                class="cart-btn"
                                data-id="${product._id}"
                            >
                                Add to Cart
                            </button>

                            <button
                                type="button"
                                class="buy-btn"
                                data-id="${product._id}"
                            >
                                Buy Now
                            </button>

                            <button
                                type="button"
                                class="wishlist-btn"
                                data-id="${product._id}"
                                aria-label="Add to wishlist"
                            >

                                <i
                                    class="${
                                        favorited
                                            ? "fa-solid fa-heart"
                                            : "fa-regular fa-heart"
                                    }"
                                ></i>

                            </button>

                        </div>

                    </article>
                `;
            })
            .join("");
};

// ======================================================
// CART FUNCTIONS
// ======================================================

const getCart = () => {
    try {
        return (
            JSON.parse(
                localStorage.getItem("cart")
            ) || []
        );
    } catch (error) {
        console.error(
            "Cart error:",
            error
        );

        return [];
    }
};

const addToCart = (product) => {
    const cart =
        getCart();

    const exists =
        cart.find(
            (item) =>
                item._id ===
                product._id
        );

    if (exists) {
        alert(
            "Product already added to cart"
        );

        return;
    }

    cart.push(product);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    alert(
        "Product added to cart"
    );
};

// ======================================================
// CART COUNT
// ======================================================

const updateCartCount = () => {
    const cart =
        getCart();

    if (cartCount) {
        cartCount.textContent =
            cart.length;
    }
};

// ======================================================
// PAGE YEAR
// ======================================================

if (year) {
    year.textContent =
        new Date().getFullYear();
}

// ======================================================
// EVENTS
// DELETE / CART / BUY / WISHLIST
// ======================================================

if (productGrid) {
    productGrid.addEventListener(
        "click",
        (event) => {

            // ------------------------------------------
            // DELETE
            // ------------------------------------------

            const deleteBtn =
                event.target.closest(
                    ".delete-btn"
                );

            if (deleteBtn) {
                const id =
                    deleteBtn.dataset.id;

                const confirmed =
                    confirm(
                        "Are you sure you want to delete this product?"
                    );

                if (confirmed) {
                    deleteProduct(id);
                }

                return;
            }

            // ------------------------------------------
            // ADD TO CART
            // ------------------------------------------

            const cartBtn =
                event.target.closest(
                    ".cart-btn"
                );

            if (cartBtn) {
                const product =
                    products.find(
                        (item) =>
                            item._id ===
                            cartBtn.dataset.id
                    );

                if (product) {
                    addToCart(product);
                }

                return;
            }

            // ------------------------------------------
            // BUY NOW
            // ------------------------------------------

            const buyBtn =
                event.target.closest(
                    ".buy-btn"
                );

            if (buyBtn) {
                const product =
                    products.find(
                        (item) =>
                            item._id ===
                            buyBtn.dataset.id
                    );

                if (product) {
                    localStorage.setItem(
                        "selectedProduct",
                        JSON.stringify(product)
                    );

                    window.location.href =
                        "product-details.html";
                }

                return;
            }

            // ------------------------------------------
            // WISHLIST
            // ------------------------------------------

            const wishlistBtn =
                event.target.closest(
                    ".wishlist-btn"
                );

            if (wishlistBtn) {
                const id =
                    wishlistBtn.dataset.id;

                if (!id) {
                    return;
                }

                const nowFavorited =
                    toggleWishlistById(id);

                const icon =
                    wishlistBtn.querySelector(
                        "i"
                    );

                if (icon) {
                    icon.className =
                        nowFavorited
                            ? "fa-solid fa-heart"
                            : "fa-regular fa-heart";
                }
            }
        }
    );
}

// ======================================================
// CREATE LISTING - ADMIN
// ======================================================

if (listingForm) {
    listingForm.addEventListener(
        "submit",
        async (event) => {
            event.preventDefault();

            const data =
                new FormData(
                    listingForm
                );

            const productData = {
                title:
                    data.get("title"),

                category:
                    data.get("category"),

                description:
                    data.get("description"),

                image:
                    data.get("image"),

                fileUrl:
                    data.get("fileUrl") ||
                    data.get("image"),

                price:
                    Number(
                        data.get("price")
                    ),

                pricing:
                    data.get("pricing") ||
                    "one-time"
            };

            try {
                await createProduct(
                    productData
                );

                if (formMessage) {
                    formMessage.textContent =
                        "Product published successfully.";
                }

                listingForm.reset();

                if (uploadStatus) {
                    uploadStatus.textContent =
                        "No file selected";
                }

            } catch (error) {
                console.error(
                    "Create product error:",
                    error
                );

                if (formMessage) {
                    formMessage.textContent =
                        "Product creation failed.";
                }
            }
        }
    );
}

// ======================================================
// FILE UPLOAD DISPLAY
// ======================================================

if (
    assetFile &&
    uploadStatus
) {
    assetFile.addEventListener(
        "change",
        () => {
            const file =
                assetFile.files[0];

            uploadStatus.textContent =
                file
                    ? "Selected file: " +
                      file.name
                    : "No file selected";
        }
    );
}

// ======================================================
// REVIEW BUTTON
// ======================================================

if (reviewButton) {
    reviewButton.addEventListener(
        "click",
        () => {

            if (!listingForm) {
                return;
            }

            const data =
                new FormData(
                    listingForm
                );

            if (reviewPanel) {
                reviewPanel.hidden =
                    false;
            }

            if (reviewContent) {
                reviewContent.innerHTML = `
                    <h4>
                        ${
                            data.get("title") ||
                            "Untitled Product"
                        }
                    </h4>

                    <p>
                        Category:
                        ${
                            data.get("category") ||
                            "Not specified"
                        }
                    </p>

                    <p>
                        Price:
                        ₹${data.get("price") || "0"}
                    </p>

                    <p>
                        Description:
                        ${
                            data.get("description") ||
                            "No description"
                        }
                    </p>
                `;
            }
        }
    );
}

// ======================================================
// INITIALIZE APP
// ======================================================

const initializeApp = () => {
    updateCartCount();
    fetchProducts();
};

// ======================================================
// START APPLICATION
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);