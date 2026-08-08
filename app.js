
// ============================================================
// DIGITAL PRODUCT HUB - COMPLETE APP.JS
// ============================================================

const API_BASE = "/api/v1/products";

// ============================================================
// FALLBACK PRODUCTS
// These products will show when backend is unavailable.
// ============================================================

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
        description: "Professional Figma UI Kit with 300+ components.",
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
    },

    {
        _id: "sample-react-native",
        title: "React Native Starter Pack",
        category: "React Native",
        description: "Complete starter resources for building React Native mobile applications.",
        price: 399,
        image: "images/React%20Native%20Starter%20Pack.png",
        pricing: "one-time"
    },

    {
        _id: "sample-figma-dashboard",
        title: "Figma Dashboard Template",
        category: "Figma Template",
        description: "Modern professional dashboard UI template designed in Figma.",
        price: 299,
        image: "images/Figma%20Dashboard%20Template.png",
        pricing: "one-time"
    }

];


// ============================================================
// PRODUCTS ARRAY
// ============================================================

let products = [...fallbackProducts];


// ============================================================
// IMAGE HELPER
// ============================================================

function getImage(image, title = "") {

    if (!image || typeof image !== "string" || image.trim() === "") {

        return "/images/default-product.png";

    }

    const trimmed = image.trim();

    // External image
    if (/^https?:\/\//i.test(trimmed)) {

        return trimmed;

    }

    // Already absolute
    if (trimmed.startsWith("/")) {

        return trimmed;

    }

    // Images folder path
    if (trimmed.startsWith("images/")) {

        return `/${trimmed}`;

    }

    const fileName = trimmed
        .split(/[\\/]/)
        .pop()
        .toLowerCase();


    // ========================================================
    // DIRECT IMAGE MAP
    // ========================================================

    const directImageMap = {

        "react.png":
            "/images/react.png",

        "uikit.png":
            "/images/uikit.png",

        "ebook.png":
            "/images/ebook.png",

        "sourcecode.png":
            "/images/sourcecode.png",

        "default-product.png":
            "/images/default-product.png",

        "premium ui kit.png":
            "/images/uikit.png",

        "figma dashboard template.png":
            "/images/Figma%20Dashboard%20Template.png",

        "react native starter pack.png":
            "/images/React%20Native%20Starter%20Pack.png"

    };


    if (directImageMap[fileName]) {

        return directImageMap[fileName];

    }


    // ========================================================
    // TITLE-BASED IMAGE MATCHING
    // ========================================================

    const text = `${trimmed} ${title}`.toLowerCase();


    if (
        text.includes("figma") &&
        text.includes("dashboard")
    ) {

        return "/images/Figma%20Dashboard%20Template.png";

    }


    if (
        text.includes("react native") ||
        text.includes("react-native")
    ) {

        return "/images/React%20Native%20Starter%20Pack.png";

    }


    if (
        text.includes("premium ui") ||
        text.includes("ui kit")
    ) {

        return "/images/uikit.png";

    }


    if (text.includes("ebook") || text.includes("book")) {

        return "/images/ebook.png";

    }


    if (
        text.includes("source") ||
        text.includes("code")
    ) {

        return "/images/sourcecode.png";

    }


    if (text.includes("react")) {

        return "/images/react.png";

    }


    return `/images/${encodeURIComponent(trimmed)}`;

}


// ============================================================
// WISHLIST
// ============================================================

const getWishlist = () => {

    try {

        return JSON.parse(
            localStorage.getItem("wishlist")
        ) || [];

    } catch (error) {

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


// ============================================================
// DOM ELEMENTS
// ============================================================

const productGrid =
    document.getElementById("product-grid");

const year =
    document.getElementById("year");

const listingForm =
    document.getElementById("listing-form");

const formMessage =
    document.getElementById("form-message");

const assetFile =
    document.getElementById("asset-file");

const uploadStatus =
    document.getElementById("upload-status");

const reviewButton =
    document.getElementById("review-btn");

const reviewPanel =
    document.getElementById("review-panel");

const reviewContent =
    document.getElementById("review-content");

const cartCount =
    document.getElementById("cart-count");

const fetchError =
    document.getElementById("fetch-error");


// ============================================================
// RENDER PRODUCTS
// ============================================================

const renderProducts = () => {

    if (!productGrid) {

        return;

    }


    if (!products.length) {

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


    const wishlist = getWishlist();


    productGrid.innerHTML = products.map((product) => {

        const favorited =
            wishlist.includes(product._id);


        const image =
            getImage(
                product.image,
                product.title
            );


        return `

            <article class="product-card">

                <img
                    src="${image}"
                    class="product-image"
                    alt="${product.title}"
                    loading="lazy"
                    onerror="
                        this.onerror=null;
                        this.src='/images/default-product.png';
                    "
                >


                <div class="product-card-header">

                    <span class="tag">
                        ${product.category || "Digital Product"}
                    </span>

                    <button
                        class="delete-btn"
                        data-id="${product._id}"
                        type="button">

                        Delete

                    </button>

                </div>


                <h3>
                    ${product.title}
                </h3>


                <p>
                    ${product.description || ""}
                </p>


                <div class="rating">
                    ⭐⭐⭐⭐⭐
                </div>


                <div class="product-meta">

                    <span>
                        ${
                            product.pricing === "subscription"
                                ? "Subscription"
                                : "Instant Download"
                        }
                    </span>

                    <strong>
                        ₹${product.price}
                    </strong>

                </div>


                <div class="product-buttons">


                    <button
                        class="cart-btn"
                        data-id="${product._id}"
                        type="button">

                        Add to Cart

                    </button>


                    <button
                        class="buy-btn"
                        data-id="${product._id}"
                        type="button">

                        Buy Now

                    </button>


                    <button
                        class="wishlist-btn"
                        data-id="${product._id}"
                        aria-label="Add to wishlist"
                        type="button">

                        <i class="${
                            favorited
                                ? "fa-solid fa-heart"
                                : "fa-regular fa-heart"
                        }"></i>

                    </button>


                </div>


            </article>

        `;

    }).join("");

};


// ============================================================
// FETCH PRODUCTS
// ============================================================

const fetchProducts = async () => {

    try {

        if (fetchError) {

            fetchError.textContent =
                "Loading products...";

        }


        const response =
            await fetch(API_BASE);


        if (!response.ok) {

            throw new Error(
                "Failed to fetch products"
            );

        }


        const data =
            await response.json();


        const apiProducts =
            Array.isArray(data.products)
                ? data.products
                : [];


        // ====================================================
        // IMPORTANT:
        // Always keep the six default products.
        // Add backend products without duplicating them.
        // ====================================================

        const backendProducts =
            apiProducts.filter((apiProduct) => {

                return !fallbackProducts.some(
                    (fallbackProduct) =>
                        fallbackProduct.title.toLowerCase() ===
                        String(apiProduct.title || "").toLowerCase()
                );

            });


        products = [
            ...fallbackProducts,
            ...backendProducts
        ];


        renderProducts();


        if (fetchError) {

            fetchError.textContent = "";

        }

    } catch (error) {

        console.error(
            "Product fetch error:",
            error
        );


        // Backend unavailable:
        // show all six fallback products.

        products = [...fallbackProducts];


        renderProducts();


        if (fetchError) {

            fetchError.textContent =
                "Showing all available products while the backend is unavailable.";

        }


        if (formMessage) {

            formMessage.textContent =
                "Could not load products from backend.";

        }

    }

};


// ============================================================
// CREATE PRODUCT
// ============================================================

const createProduct = async (payload) => {

    const response =
        await fetch(API_BASE, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(payload)

        });


    if (!response.ok) {

        throw new Error(
            "Create failed"
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


// ============================================================
// DELETE PRODUCT
// ============================================================

const deleteProduct = async (id) => {

    // Don't delete fallback products from backend
    // because they are only frontend sample products.

    const isFallback =
        fallbackProducts.some(
            product => product._id === id
        );


    if (isFallback) {

        alert(
            "This sample product cannot be deleted from the backend."
        );

        return;

    }


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
                product => product._id !== id
            );


        renderProducts();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete product."
        );

    }

};


// ============================================================
// CART
// ============================================================

const addToCart = (product) => {

    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    const exists =
        cart.find(
            item => item._id === product._id
        );


    if (exists) {

        alert(
            "Product already added to cart."
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
        "Product added to cart."
    );

};


// ============================================================
// UPDATE CART COUNT
// ============================================================

const updateCartCount = () => {

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    if (cartCount) {

        cartCount.textContent =
            cart.length;

    }

};


// ============================================================
// PRODUCT BUTTON EVENTS
// ============================================================

if (productGrid) {

    productGrid.addEventListener(
        "click",
        (event) => {


            // =================================================
            // DELETE
            // =================================================

            const deleteBtn =
                event.target.closest(
                    ".delete-btn"
                );


            if (deleteBtn) {

                deleteProduct(
                    deleteBtn.dataset.id
                );

                return;

            }


            // =================================================
            // CART
            // =================================================

            const cartBtn =
                event.target.closest(
                    ".cart-btn"
                );


            if (cartBtn) {

                const product =
                    products.find(
                        item =>
                            item._id ===
                            cartBtn.dataset.id
                    );


                if (product) {

                    addToCart(product);

                }

                return;

            }


            // =================================================
            // BUY NOW
            // =================================================

            const buyBtn =
                event.target.closest(
                    ".buy-btn"
                );


            if (buyBtn) {

                const product =
                    products.find(
                        item =>
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


            // =================================================
            // WISHLIST
            // =================================================

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


// ============================================================
// SEARCH
// ============================================================

const searchInput =
    document.getElementById("search");


if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            const query =
                searchInput.value
                    .trim()
                    .toLowerCase();


            if (!query) {

                renderProducts();

                return;

            }


            const filteredProducts =
                products.filter(
                    product => {

                        return (

                            String(
                                product.title || ""
                            )
                            .toLowerCase()
                            .includes(query)

                            ||

                            String(
                                product.category || ""
                            )
                            .toLowerCase()
                            .includes(query)

                            ||

                            String(
                                product.description || ""
                            )
                            .toLowerCase()
                            .includes(query)

                        );

                    }
                );


            const oldProducts =
                products;


            products =
                filteredProducts;


            renderProducts();


            products =
                oldProducts;

        }
    );

}


// ============================================================
// CREATE LISTING - SELLER DASHBOARD
// ============================================================

if (listingForm) {

    listingForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const data =
                new FormData(listingForm);


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
                    data.get("image"),

                price:
                    Number(
                        data.get("price")
                    ),

                pricing:
                    data.get("pricing")

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


            } catch (error) {

                console.error(error);


                if (formMessage) {

                    formMessage.textContent =
                        "Product creation failed.";

                }

            }

        }
    );

}


// ============================================================
// FILE UPLOAD DISPLAY
// ============================================================

if (assetFile && uploadStatus) {

    assetFile.addEventListener(
        "change",
        () => {

            const file =
                assetFile.files[0];


            uploadStatus.textContent =
                file
                    ? "Selected file : " + file.name
                    : "No file selected";

        }
    );

}


// ============================================================
// REVIEW BUTTON
// ============================================================

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
                        ${data.get("title") || ""}
                    </h4>

                    <p>
                        Category:
                        ${data.get("category") || ""}
                    </p>

                    <p>
                        Price:
                        ₹${data.get("price") || 0}
                    </p>

                `;

            }

        }
    );

}


// ============================================================
// YEAR
// ============================================================

if (year) {

    year.textContent =
        new Date().getFullYear();

}


// ============================================================
// INITIALIZE APP
// ============================================================

const initializeApp = () => {

    updateCartCount();

    renderProducts();

    fetchProducts();

};


// ============================================================
// DOM READY
// ============================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeApp
    );

} else {

    initializeApp();

}


