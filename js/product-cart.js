(() => {
  "use strict";

  const CART_EMAIL = "mystick14minal@gmail.com";
  const STORAGE_KEY = "cafertCart";

  const PRODUCTS = [
    { id: "dryfruit-cashew", name: "Premium Kaju (Cashews)", price: 850, img: "img/index/dryfruit-cashew.jpg", desc: "Whole roasted cashews, lightly salted, 250g pack.", category: "Nuts" },
    { id: "dryfruit-almond", name: "California Almonds", price: 480, img: "img/index/dryfruit-almond.jpg", desc: "Crunchy raw almonds, rich in protein, 250g pack.", category: "Nuts" },
    { id: "dryfruit-walnut", name: "Kashmiri Walnuts", price: 560, img: "img/index/dryfruit-walnut.jpg", desc: "Fresh shelled walnut halves, buttery and rich, 250g pack.", category: "Nuts" },
    { id: "dryfruit-pistachio", name: "Roasted Pistachios", price: 980, img: "img/index/dryfruit-pistachio.jpg", desc: "Lightly salted roasted pistachios, 250g pack.", category: "Nuts" },
    { id: "dryfruit-peanut", name: "Roasted Peanuts", price: 180, img: "img/index/dryfruit-peanut.jpg", desc: "Crunchy masala-roasted peanuts, 250g pack.", category: "Nuts" },
    { id: "dryfruit-raisin", name: "Golden Raisins (Kismis)", price: 220, img: "img/index/dryfruit-raisin.jpg", desc: "Sweet seedless golden raisins, 250g pack.", category: "Dried Fruits" },
    { id: "dryfruit-apricot", name: "Dried Apricots", price: 320, img: "img/index/dryfruit-apricot.jpg", desc: "Sun-dried apricots, naturally sweet and tangy, 250g pack.", category: "Dried Fruits" },
    { id: "dryfruit-fig", name: "Dried Figs (Anjeer)", price: 420, img: "img/index/dryfruit-fig.jpg", desc: "Soft dried figs, rich in fiber, 250g pack.", category: "Dried Fruits" },
    { id: "dryfruit-date", name: "Premium Dates (Khajur)", price: 280, img: "img/index/dryfruit-date.jpg", desc: "Soft, naturally sweet dried dates, 250g pack.", category: "Dried Fruits" },
    { id: "dryfruit-mulberry", name: "Dried Mulberries", price: 350, img: "img/index/dryfruit-mulberry.jpg", desc: "Naturally sweet dried mulberries, 200g pack.", category: "Dried Fruits" },
    { id: "dryfruit-trailmix", name: "Himalayan Trail Mix", price: 380, img: "img/index/dryfruit-trailmix.jpg", desc: "Almonds, cashews, raisins and dried berries blended together, 300g pack.", category: "Mixes & Trail" },
    { id: "dryfruit-berrynut", name: "Berry & Nut Mix", price: 340, img: "img/index/dryfruit-berrynut.jpg", desc: "Cranberries, pistachios, walnuts and almonds, 250g pack.", category: "Mixes & Trail" },
    { id: "dryfruit-pumpkinseed", name: "Roasted Pumpkin Seeds", price: 260, img: "img/index/dryfruit-pumpkinseed.jpg", desc: "Crunchy roasted pumpkin seeds, rich in minerals, 200g pack.", category: "Seeds & Extras" }
  ];

  const CATEGORIES = ["All", "Nuts", "Dried Fruits", "Mixes & Trail", "Seeds & Extras"];

  const productById = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

  const formatPrice = (n) => `Rs. ${n}`;

  const loadCart = () => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return raw && typeof raw === "object" ? raw : {};
    } catch (e) {
      return {};
    }
  };

  let cart = loadCart();

  const saveCart = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));

  const cartEntries = () =>
    Object.entries(cart)
      .filter(([id, qty]) => productById[id] && qty > 0)
      .map(([id, qty]) => ({ ...productById[id], qty }));

  const cartTotal = () => cartEntries().reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = () => cartEntries().reduce((sum, item) => sum + item.qty, 0);

  let activeCategory = "All";

  // Elements
  const productGrid = document.getElementById("productGrid");
  const productFilters = document.getElementById("productFilters");
  const cartTrigger = document.getElementById("cartTrigger");
  const cartCountEl = document.getElementById("cartCount");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartDrawer = document.getElementById("cartDrawer");
  const cartClose = document.getElementById("cartClose");
  const cartItemsEl = document.getElementById("cartItems");
  const cartEmptyEl = document.getElementById("cartEmpty");
  const cartTotalEl = document.getElementById("cartTotal");
  const cartBuyBtn = document.getElementById("cartBuyBtn");

  const checkoutOverlay = document.getElementById("checkoutOverlay");
  const checkoutModal = document.getElementById("checkoutModal");
  const checkoutClose = document.getElementById("checkoutClose");
  const checkoutSummary = document.getElementById("checkoutSummary");
  const checkoutTotalEl = document.getElementById("checkoutTotal");
  const checkoutForm = document.getElementById("checkoutForm");
  const checkoutStatus = document.getElementById("checkoutStatus");
  const checkoutSubmit = document.getElementById("checkoutSubmit");

  function renderFilters() {
    productFilters.innerHTML = CATEGORIES.map((cat) => `
      <button type="button" class="product_filter${cat === activeCategory ? " is-active" : ""}" data-category="${cat}">${cat}</button>
    `).join("");
  }

  function renderProducts() {
    const items = activeCategory === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory);
    productGrid.innerHTML = items.map((p, i) => `
      <div class="product_card" style="animation-delay:${(i % 8) * 0.06}s">
        <span class="product_card-tag">${p.category}</span>
        <div class="product_card-media"><img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'"></div>
        <div class="product_card-body">
          <div class="product_card-name">${p.name}</div>
          <p class="product_card-desc">${p.desc}</p>
          <div class="product_card-footer">
            <span class="product_card-price">${formatPrice(p.price)}</span>
            <button type="button" class="product_card-add" data-id="${p.id}">Add to Cart</button>
          </div>
        </div>
      </div>
    `).join("");
  }

  function renderCart() {
    const entries = cartEntries();
    cartCountEl.textContent = String(cartCount());
    cartTotalEl.textContent = formatPrice(cartTotal());
    cartBuyBtn.disabled = entries.length === 0;

    if (entries.length === 0) {
      cartItemsEl.innerHTML = "";
      cartItemsEl.appendChild(cartEmptyEl);
      cartEmptyEl.style.display = "block";
      return;
    }

    cartItemsEl.innerHTML = entries.map((item) => `
      <div class="cart_item" data-id="${item.id}">
        <div class="cart_item-media"><img src="${item.img}" alt="${item.name}"></div>
        <div class="cart_item-main">
          <span class="cart_item-name">${item.name}</span>
          <span class="cart_item-price">${formatPrice(item.price)} each</span>
          <div class="cart_item-row">
            <div class="cart_item-qty">
              <button type="button" class="cart_qty-minus" data-id="${item.id}" aria-label="Decrease quantity">-</button>
              <span>${item.qty}</span>
              <button type="button" class="cart_qty-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
            </div>
            <span class="cart_item-linetotal">${formatPrice(item.price * item.qty)}</span>
          </div>
          <span class="cart_item-remove" data-id="${item.id}">Remove</span>
        </div>
      </div>
    `).join("");
  }

  function addToCart(id, btn) {
    cart[id] = (cart[id] || 0) + 1;
    saveCart();
    renderCart();
    if (btn) {
      const original = btn.textContent;
      btn.textContent = "Added!";
      btn.classList.add("is-added");
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove("is-added");
      }, 900);
    }
    cartTrigger.classList.remove("is-bumping");
    void cartTrigger.offsetWidth;
    cartTrigger.classList.add("is-bumping");
  }

  function changeQty(id, delta) {
    if (!cart[id]) return;
    cart[id] += delta;
    if (cart[id] <= 0) delete cart[id];
    saveCart();
    renderCart();
  }

  function removeItem(id) {
    delete cart[id];
    saveCart();
    renderCart();
  }

  function lockScroll(lock) {
    document.documentElement.classList.toggle("fixed", lock);
  }

  function openCart() {
    renderCart();
    cartOverlay.classList.add("is-open");
    cartDrawer.classList.add("is-open");
    cartDrawer.setAttribute("aria-hidden", "false");
    lockScroll(true);
  }

  function closeCart() {
    cartOverlay.classList.remove("is-open");
    cartDrawer.classList.remove("is-open");
    cartDrawer.setAttribute("aria-hidden", "true");
    if (!checkoutModal.classList.contains("is-open")) lockScroll(false);
  }

  function openCheckout() {
    const entries = cartEntries();
    if (entries.length === 0) return;

    cartOverlay.classList.remove("is-open");
    cartDrawer.classList.remove("is-open");
    cartDrawer.setAttribute("aria-hidden", "true");

    checkoutSummary.innerHTML = entries.map((item) => `
      <li><span>${item.name} × ${item.qty}</span><span>${formatPrice(item.price * item.qty)}</span></li>
    `).join("");
    checkoutTotalEl.textContent = formatPrice(cartTotal());
    checkoutStatus.textContent = "";
    checkoutStatus.className = "checkout_status";
    checkoutSubmit.disabled = false;
    checkoutSubmit.textContent = "Send Order";

    checkoutOverlay.classList.add("is-open");
    checkoutModal.classList.add("is-open");
    checkoutModal.setAttribute("aria-hidden", "false");
    lockScroll(true);
  }

  function closeCheckout() {
    checkoutOverlay.classList.remove("is-open");
    checkoutModal.classList.remove("is-open");
    checkoutModal.setAttribute("aria-hidden", "true");
    if (!cartDrawer.classList.contains("is-open")) lockScroll(false);
  }

  async function submitOrder(e) {
    e.preventDefault();
    const entries = cartEntries();
    if (entries.length === 0) return;

    const formData = new FormData(checkoutForm);
    const orderLines = entries
      .map((item) => `${item.name} x${item.qty} — ${formatPrice(item.price * item.qty)}`)
      .join("\n");

    const payload = {
      Name: formData.get("name"),
      Email: formData.get("email"),
      Phone: formData.get("phone"),
      "Delivery Address": formData.get("address"),
      Notes: formData.get("notes") || "-",
      Order: orderLines,
      Total: formatPrice(cartTotal()),
      _subject: `New स्वादgasm order from ${formData.get("name")}`,
      _captcha: "false"
    };

    checkoutSubmit.disabled = true;
    checkoutSubmit.textContent = "Sending...";
    checkoutStatus.textContent = "";
    checkoutStatus.className = "checkout_status";

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CART_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Request failed");

      checkoutStatus.textContent = "Order sent! We'll reach out to confirm shortly.";
      checkoutStatus.className = "checkout_status is-success";
      cart = {};
      saveCart();
      renderCart();
      checkoutForm.reset();
      checkoutSubmit.textContent = "Sent";

      setTimeout(() => {
        closeCheckout();
        closeCart();
      }, 2000);
    } catch (err) {
      checkoutStatus.textContent = "Something went wrong sending your order. Please try again.";
      checkoutStatus.className = "checkout_status is-error";
      checkoutSubmit.disabled = false;
      checkoutSubmit.textContent = "Send Order";
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderFilters();
    renderProducts();
    renderCart();

    productFilters.addEventListener("click", (e) => {
      const btn = e.target.closest(".product_filter");
      if (!btn) return;
      activeCategory = btn.dataset.category;
      renderFilters();
      renderProducts();
    });

    productGrid.addEventListener("click", (e) => {
      const btn = e.target.closest(".product_card-add");
      if (btn) addToCart(btn.dataset.id, btn);
    });

    cartItemsEl.addEventListener("click", (e) => {
      const minus = e.target.closest(".cart_qty-minus");
      const plus = e.target.closest(".cart_qty-plus");
      const remove = e.target.closest(".cart_item-remove");
      if (minus) changeQty(minus.dataset.id, -1);
      if (plus) changeQty(plus.dataset.id, 1);
      if (remove) removeItem(remove.dataset.id);
    });

    cartTrigger.addEventListener("click", openCart);
    cartClose.addEventListener("click", closeCart);
    cartOverlay.addEventListener("click", closeCart);

    cartBuyBtn.addEventListener("click", openCheckout);
    checkoutClose.addEventListener("click", closeCheckout);
    checkoutOverlay.addEventListener("click", closeCheckout);

    checkoutForm.addEventListener("submit", submitOrder);

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (checkoutModal.classList.contains("is-open")) closeCheckout();
      else if (cartDrawer.classList.contains("is-open")) closeCart();
    });
  });
})();
