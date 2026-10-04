/* =====================================================
   VARIABLES
===================================================== */

const searchInput = document.getElementById("searchInput");
const searchCategory = document.getElementById("searchCategory");
const searchButton = document.getElementById("searchButton");

const cartButton = document.getElementById("cartButton");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const toast = document.getElementById("toast");

const signInButton = document.getElementById("signInButton");
const accountButton = document.getElementById("accountButton");

const signInModal = document.getElementById("signInModal");
const closeSignIn = document.getElementById("closeSignIn");

const continueButton = document.getElementById("continueButton");
const emailInput = document.getElementById("emailInput");

const backToTop = document.getElementById("backToTop");
const footerBackTop = document.getElementById("footerBackTop");

const mobileMenuButton = document.getElementById("mobileMenuButton");
const mobileMenu = document.getElementById("mobileMenu");
const closeMobileMenu = document.getElementById("closeMobileMenu");


/* =====================================================
   CART
===================================================== */

let cart = [];


/* =====================================================
   LOAD CART FROM LOCAL STORAGE
===================================================== */

function loadCart() {

    const savedCart = localStorage.getItem("amazonCloneCart");

    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (error) {
            cart = [];
        }
    }

    updateCart();
}


/* =====================================================
   SAVE CART
===================================================== */

function saveCart() {
    localStorage.setItem(
        "amazonCloneCart",
        JSON.stringify(cart)
    );
}


/* =====================================================
   ADD TO CART
===================================================== */

function addToCart(productCard) {

    const name = productCard.dataset.name;
    const price = Number(productCard.dataset.price);

    const image = productCard.querySelector("img").src;

    const existingProduct = cart.find(
        item => item.name === name
    );

    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            id: Date.now(),
            name: name,
            price: price,
            image: image,
            quantity: 1
        });

    }

    saveCart();
    updateCart();

    showToast(`${name} added to cart`);
}


/* =====================================================
   UPDATE CART
===================================================== */

function updateCart() {

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = totalQuantity;

    renderCart();

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    cartTotal.textContent = `$${total.toFixed(2)}`;
}


/* =====================================================
   RENDER CART
===================================================== */

function renderCart() {

    if (cart.length === 0) {

        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-cart-shopping"></i>
                <p>Your Amazon Clone cart is empty.</p>
            </div>
        `;

        return;
    }


    cartItemsContainer.innerHTML = "";


    cart.forEach(item => {

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <img src="${item.image}" alt="${item.name}">

            <div>

                <h4>${item.name}</h4>

                <div class="cart-item-price">
                    $${item.price.toFixed(2)}
                </div>

                <div class="quantity-controls">

                    <button
                        class="quantity-minus"
                        data-id="${item.id}">
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        class="quantity-plus"
                        data-id="${item.id}">
                        +
                    </button>

                </div>

            </div>

            <button
                class="remove-item"
                data-id="${item.id}">
                <i class="fa-solid fa-trash"></i>
            </button>

        `;

        cartItemsContainer.appendChild(cartItem);

    });


    addCartControlListeners();
}


/* =====================================================
   CART CONTROLS
===================================================== */

function addCartControlListeners() {

    const plusButtons =
        document.querySelectorAll(".quantity-plus");

    const minusButtons =
        document.querySelectorAll(".quantity-minus");

    const removeButtons =
        document.querySelectorAll(".remove-item");


    plusButtons.forEach(button => {

        button.addEventListener("click", () => {

            const id = Number(button.dataset.id);

            const item = cart.find(
                product => product.id === id
            );

            if (item) {
                item.quantity += 1;
            }

            saveCart();
            updateCart();

        });

    });


    minusButtons.forEach(button => {

        button.addEventListener("click", () => {

            const id = Number(button.dataset.id);

            const item = cart.find(
                product => product.id === id
            );

            if (!item) return;

            item.quantity -= 1;

            if (item.quantity <= 0) {

                cart = cart.filter(
                    product => product.id !== id
                );

            }

            saveCart();
            updateCart();

        });

    });


    removeButtons.forEach(button => {

        button.addEventListener("click", () => {

            const id = Number(button.dataset.id);

            cart = cart.filter(
                product => product.id !== id
            );

            saveCart();
            updateCart();

        });

    });

}


/* =====================================================
   OPEN CART
===================================================== */

function openCart() {

    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");

    document.body.style.overflow = "hidden";
}


/* =====================================================
   CLOSE CART
===================================================== */

function closeCartSidebar() {

    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");

    document.body.style.overflow = "";
}


/* =====================================================
   CART EVENTS
===================================================== */

cartButton.addEventListener("click", openCart);

closeCart.addEventListener(
    "click",
    closeCartSidebar
);

cartOverlay.addEventListener(
    "click",
    closeCartSidebar
);


/* =====================================================
   ADD CART BUTTONS
===================================================== */

document.querySelectorAll(".add-cart").forEach(button => {

    button.addEventListener("click", () => {

        const productCard =
            button.closest(".product-card");

        addToCart(productCard);

    });

});


/* =====================================================
   TOAST
===================================================== */

let toastTimer;

function showToast(message) {

    const toastText =
        toast.querySelector("span");

    toastText.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* =====================================================
   HERO SLIDER
===================================================== */

const slides =
    document.querySelectorAll(".hero-slide");

const dots =
    document.querySelectorAll(".dot");

const previousSlide =
    document.getElementById("previousSlide");

const nextSlide =
    document.getElementById("nextSlide");

let currentSlide = 0;


function showSlide(index) {

    if (index >= slides.length) {
        currentSlide = 0;
    }

    if (index < 0) {
        currentSlide = slides.length - 1;
    }

    slides.forEach(slide => {
        slide.classList.remove("active");
    });

    dots.forEach(dot => {
        dot.classList.remove("active");
    });

    slides[currentSlide].classList.add("active");

    dots[currentSlide].classList.add("active");
}


function nextHeroSlide() {

    currentSlide++;

    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }

    showSlide(currentSlide);
}


function previousHeroSlide() {

    currentSlide--;

    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }

    showSlide(currentSlide);
}


nextSlide.addEventListener(
    "click",
    nextHeroSlide
);

previousSlide.addEventListener(
    "click",
    previousHeroSlide
);


dots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

        currentSlide = index;

        showSlide(currentSlide);

    });

});


/* AUTO SLIDE */

let sliderTimer =
    setInterval(nextHeroSlide, 5000);


/* =====================================================
   PRODUCT HORIZONTAL SLIDERS
===================================================== */

document.querySelectorAll(".product-arrow").forEach(button => {

    button.addEventListener("click", () => {

        const targetId =
            button.dataset.target;

        const container =
            document.getElementById(targetId);

        const scrollAmount = 500;

        if (button.classList.contains("right")) {

            container.scrollBy({
                left: scrollAmount,
                behavior: "smooth"
            });

        } else {

            container.scrollBy({
                left: -scrollAmount,
                behavior: "smooth"
            });

        }

    });

});


/* =====================================================
   SEARCH
===================================================== */

function performSearch() {

    const query =
        searchInput.value.trim().toLowerCase();

    const category =
        searchCategory.value.toLowerCase();


    const products =
        document.querySelectorAll(".product-card");


    if (!query && category === "all") {

        products.forEach(product => {

            product.style.display = "";

        });

        return;

    }


    let foundProducts = 0;


    products.forEach(product => {

        const name =
            product.dataset.name.toLowerCase();

        const productCategory =
            product.dataset.category.toLowerCase();


        const matchesText =
            !query || name.includes(query);

        const matchesCategory =
            category === "all" ||
            productCategory === category;


        if (matchesText && matchesCategory) {

            product.style.display = "";

            foundProducts++;

        } else {

            product.style.display = "none";

        }

    });


    if (foundProducts === 0) {

        showToast("No matching products found");

    } else {

        const productSection =
            document.querySelector(".products-section");

        if (productSection) {

            productSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

        showToast("${foundProducts} product(s) found");

    }

}


searchButton.addEventListener(
    "click",
    performSearch
);


searchInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            performSearch();

        }

    }
);


/* =====================================================
   SIGN IN MODAL
===================================================== */

function openSignInModal() {

    signInModal.classList.add("active");

    document.body.style.overflow = "hidden";

    setTimeout(() => {

        emailInput.focus();

    }, 200);

}


function closeSignInModal() {

    signInModal.classList.remove("active");

    document.body.style.overflow = "";

}


signInButton.addEventListener(
    "click",
    openSignInModal
);


accountButton.addEventListener(
    "click",
    openSignInModal
);


closeSignIn.addEventListener(
    "click",
    closeSignInModal
);


signInModal.addEventListener(
    "click",
    event => {

        if (event.target === signInModal) {

            closeSignInModal();

        }

    }
);


/* =====================================================
   SIGN IN CONTINUE
===================================================== */

continueButton.addEventListener(
    "click",
    () => {

        const email =
            emailInput.value.trim();

        if (!email) {

            emailInput.style.border =
                "2px solid #c40000";

            emailInput.focus();

            return;

        }


        emailInput.style.border =
            "1px solid #888";


        showToast(
            `Welcome! Sign-in demo for ${email}`
        );

        closeSignInModal();

    }
);


/* =====================================================
   MOBILE MENU
===================================================== */

mobileMenuButton.addEventListener(
    "click",
    () => {

        mobileMenu.classList.add("active");

    }
);


closeMobileMenu.addEventListener(
    "click",
    () => {

        mobileMenu.classList.remove("active");

    }
);


/* =====================================================
   BACK TO TOP
===================================================== */

window.addEventListener(
    "scroll",
    () => {

        if (window.scrollY > 500) {

            backToTop.classList.add("show");

        } else {

            backToTop.classList.remove("show");

        }

    }
);


function scrollToTop() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


backToTop.addEventListener(
    "click",
    scrollToTop
);


footerBackTop.addEventListener(
    "click",
    scrollToTop
);


/* =====================================================
   CHECKOUT
===================================================== */

const checkoutButton =
    document.getElementById("checkoutButton");


checkoutButton.addEventListener(
    "click",
    () => {

        if (cart.length === 0) {

            showToast("Your cart is empty");

            return;

        }

        showToast(
            "Checkout demo — payment is not connected"
        );

    }
);


/* =====================================================
   ESCAPE KEY
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeCartSidebar();

            closeSignInModal();

            mobileMenu.classList.remove("active");

        }

    }
);


/* =====================================================
   INITIALIZE
===================================================== */

loadCart();

showSlide(0);

