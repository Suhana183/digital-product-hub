```javascript
// ============================================================
// DIGITAL PRODUCT HUB - APP.JS
// ============================================================

const API_BASE = "/api/v1/products";


// ============================================================
// DEFAULT PRODUCTS
// ============================================================

const defaultProducts = [

    {
        _id: "react-course",
        title: "React Mastery Course",
        category: "Course",
        description: "Complete React learning material with projects and notes.",
        price: 499,
        image: "images/react.png",
        pricing: "one-time"
    },

    {
        _id: "premium-ui-kit",
        title: "Premium UI Kit",
        category: "UI Kit",
        description: "Professional Figma UI Kit with 300+ components.",
        price: 49,
        image: "images/uikit.png",
        pricing: "one-time"
    },

    {
        _id: "javascript-guide",
        title: "JavaScript Master Guide",
        category: "E-book",
        description: "Learn modern JavaScript from beginner to advanced with practical examples.",
        price: 199,
        image: "images/ebook.png",
        pricing: "one-time"
    },

    {
        _id: "ecommerce-source-code",
        title: "E-commerce Website",
        category: "Source Code",
        description: "Complete responsive shopping website source code with HTML, CSS and JavaScript.",
        price: 299,
        image: "images/sourcecode.png",
        pricing: "one-time"
    },

    {
        _id: "react-native-starter",
        title: "React Native Starter Pack",
        category: "React Native",
        description: "Complete starter resources for building React Native mobile applications.",
        price: 399,
        image: "images/React Native Starter Pack.png",
        pricing: "one-time"
    },

    {
        _id: "figma-dashboard",
        title: "Figma Dashboard Template",
        category: "Figma Template",
        description: "Modern professional dashboard UI template designed in Figma.",
        price: 299,
        image: "images/Figma Dashboard Template.png",
        pricing: "one-time"
    }

];


let products = [...defaultProducts];


// ============================================================
// DOM ELEMENTS
// ============================================================

const productGrid =
    document.getElementById("product-grid");

const cartCount =
    document.getElementById("cart-count");

const fetchError =
    document.getElementById("fetch-error");

const year =
    document.getElementById("year");


// ============================================================
// IMAGE FUNCTION
// ============================================================

function getImage(image, title = "") {

    if (!image) {

        return "/images/default-product.png";

    }


    if (image.startsWith("http")) {

        return image;

    }


    let fileName =
        image
            .split("/")
            .pop()
            .toLowerCase();


    if (fileName === "react.png") {

        return "/images/react.png";

    }


    if (fileName === "uikit.png") {

        return "/images/uikit.png";

    }


    if (fileName === "ebook.png") {

        return "/images/ebook.png";

    }


    if (fileName === "sourcecode.png") {

        return "/images/sourcecode.png";

    }


    if (
        fileName.includes("react native") ||
        title.toLowerCase().includes("react native")
    ) {

        return "/images/React%20Native%20Starter%20Pack.png";

    }


    if (
        fileName.includes("figma dashboard") ||
        title.toLowerCase().includes("figma dashboard")
    ) {

        return "/images/Figma%20Dashboard%20Template.png";

    }


    return image.startsWith("/")
        ? image
        : "/" + image;

}


// ============================================================
// CART
// ============================================================

function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    } catch (error) {

        return [];

    }

}


function saveCart(cart) {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


// ============================================================
// UPDATE CART COUNT
// ============================================================

function updateCartCount() {

    const cart =
        getCart();


    if (cartCount) {

        cartCount.textContent =
            cart.length;

    }

}


// ============================================================
// ADD TO CART
// ============================================================

function addToCart(product) {

    if (!product) {

        return;

    }


    const cart =
        getCart();


    const existing =
        cart.find(
            item =>
                String(item._id) ===
                String(product._id)
        );


    if (existing) {

        alert(
            "This product is already in your cart."
        );

        return;

    }


    cart.push({

        _id: product._id,

        title: product.title,

        category: product.category,

        description: product.description,

        price: Number(product.price) || 0,

        image: product.image,

        pricing: product.pricing || "one-time"

    });


    saveCart(cart);

    updateCartCount();


    alert(
        `${product.title} added to cart!`
    );

}


// ============================================================
// BUY NOW
// ============================================================

function buyNow(product) {

    if (!product) {

        return;

    }


    // Save selected product

    localStorage.setItem(
        "selectedProduct",
        JSON.stringify(product)
    );


    // Also add it to cart

    const cart =
        getCart();


    const exists =
        cart.find(
            item =>
                String(item._id) ===
                String(product._id)
        );


    if (!exists) {

        cart.push({

            _id: product._id,

            title: product.title,

            category: product.category,

            description: product.description,

            price: Number(product.price) || 0,

            image: product.image,

            pricing: product.pricing || "one-time"

        });


        saveCart(cart);

    }


    updateCartCount();


    // Go to cart

    window.location.href =
        "cart.html";

}


// ============================================================
// RENDER PRODUCTS
// ============================================================

function renderProducts() {

    if (!productGrid) {

        return;

    }


    productGrid.innerHTML =
        products.map(product => {

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


                    <div class="product-details">


                        <span class="tag">

                            ${product.category || "Digital Product"}

                        </span>


                        <h3>

                            ${product.title}

                        </h3>


                        <p>

                            ${product.description || ""}

                        </p>


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


                        <div class="buttons">


                            <button

                                class="buy-btn"

                                type="button"

                                data-id="${product._id}"

                            >

                                Buy Now

                            </button>


                            <button

                                class="cart-btn"

                                type="button"

                                data-id="${product._id}"

                            >

                                Add to Cart

                            </button>


                        </div>


                    </div>


                </article>

            `;

        }).join("");

}


// ============================================================
// BUTTON EVENTS
// ============================================================

if (productGrid) {

    productGrid.addEventListener(
        "click",
        function (event) {


            // ==================================================
            // ADD TO CART
            // ==================================================

            const cartButton =
                event.target.closest(
                    ".cart-btn"
                );


            if (cartButton) {

                const id =
                    cartButton.dataset.id;


                const product =
                    products.find(
                        item =>
                            String(item._id) ===
                            String(id)
                    );


                if (product) {

                    addToCart(product);

                }

                return;

            }


            // ==================================================
            // BUY NOW
            // ==================================================

            const buyButton =
                event.target.closest(
                    ".buy-btn"
                );


            if (buyButton) {

                const id =
                    buyButton.dataset.id;


                const product =
                    products.find(
                        item =>
                            String(item._id) ===
                            String(id)
                    );


                if (product) {

                    buyNow(product);

                }

                return;

            }

        }
    );

}


// ============================================================
// FETCH PRODUCTS FROM BACKEND
// ============================================================

async function fetchProducts() {

    try {

        const response =
            await fetch(API_BASE);


        if (!response.ok) {

            throw new Error(
                "Backend unavailable"
            );

        }


        const data =
            await response.json();


        const backendProducts =
            Array.isArray(data.products)
                ? data.products
                : [];


        // Keep default six products
        // and add backend products.

        const additionalProducts =
            backendProducts.filter(
                backendProduct => {

                    return !defaultProducts.some(
                        defaultProduct =>
                            defaultProduct.title.toLowerCase() ===
                            String(
                                backendProduct.title || ""
                            ).toLowerCase()
                    );

                }
            );


        products = [

            ...defaultProducts,

            ...additionalProducts

        ];


        renderProducts();


        if (fetchError) {

            fetchError.textContent = "";

        }

    } catch (error) {

        console.log(
            "Backend unavailable. Showing default products."
        );


        products =
            [...defaultProducts];


        renderProducts();


        if (fetchError) {

            fetchError.textContent =
                "Showing featured products while the backend is unavailable.";

        }

    }

}


// ============================================================
// SEARCH
// ============================================================

const searchInput =
    document.getElementById("search");


if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            const search =
                searchInput.value
                    .trim()
                    .toLowerCase();


            if (!search) {

                renderProducts();

                return;

            }


            const filtered =
                products.filter(
                    product => {

                        return (

                            product.title
                                .toLowerCase()
                                .includes(search)

                            ||

                            String(
                                product.category || ""
                            )
                            .toLowerCase()
                            .includes(search)

                            ||

                            String(
                                product.description || ""
                            )
                            .toLowerCase()
                            .includes(search)

                        );

                    }
                );


            const oldProducts =
                products;


            products =
                filtered;


            renderProducts();


            products =
                oldProducts;

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
// INITIALIZE
// ============================================================

function initializeApp() {

    updateCartCount();

    renderProducts();

    fetchProducts();

}


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
```



