(() => {
  "use strict";

  const CART_EMAIL = "mystick14minal@gmail.com";
  const STORAGE_KEY = "cafertCart";

  const PRODUCTS = [
    {
      id: "signature-coffee",
      name: "Nuwakot Washed Coffee",
      price: 1100,
      img: "img/products/signature-coffee-thumb.jpg",
      full: "img/products/signature-coffee.jpg",
      desc: "Single-origin washed beans from Nuwakot, Nepal. 250g resealable bag.",
      category: "Coffee",
      specs: [
        ["Net weight", "250 g"],
        ["Origin", "Nuwakot, Nepal"],
        ["Altitude", "1,000-1,200 m.a.s.l."],
        ["Process", "Washed"],
        ["Tasting notes", "Lemongrass, caramel, molasses"],
        ["Brew", "French Press"]
      ]
    },
    {
      id: "vital-energy-seeds",
      name: "Vital Energy Seeds",
      price: 289,
      img: "img/products/vital-energy-seeds-thumb.jpg",
      full: "img/products/vital-energy-seeds.jpg",
      desc: "House-roasted seed blend, seasoned and sealed in a glass jar. 110g.",
      category: "Seeds & Nuts",
      specs: [
        ["Net weight", "110 g"],
        ["Packaged for", "21st July"],
        ["Best before", "6 months"]
      ]
    },
    {
      id: "ember-reserve-nuts",
      name: "Ember Reserve Nuts",
      price: 350,
      img: "img/products/ember-reserve-nuts-thumb.jpg",
      full: "img/products/ember-reserve-nuts.jpg",
      desc: "Slow-roasted premium nuts in a corked glass tube. 50g.",
      category: "Seeds & Nuts",
      specs: [
        ["Net weight", "50 g"],
        ["Packaged for", "22nd July"],
        ["Best before", "6 months"]
      ]
    },
    {
      id: "cocoa-pulse-balls-jar",
      name: "Cocoa Pulse Balls - Jar",
      price: 239,
      img: "img/products/cocoa-pulse-balls-jar-thumb.jpg",
      full: "img/products/cocoa-pulse-balls-jar.jpg",
      desc: "Dark cocoa and pulse energy balls in a sealed glass jar. 120gm.",
      category: "Bites & Balls",
      specs: [
        ["Net weight", "120 gm"],
        ["Mfg date", "10th August"],
        ["Best before", "21 days"]
      ]
    },
    {
      id: "cocoa-pulse-balls-tube",
      name: "Cocoa Pulse Balls - Tube",
      price: 139,
      img: "img/products/cocoa-pulse-balls-tube-thumb.jpg",
      full: "img/products/cocoa-pulse-balls-tube.jpg",
      desc: "The same cocoa pulse balls in a corked glass tube - easy to gift. 120gm.",
      category: "Bites & Balls",
      specs: [
        ["Net weight", "120 gm"],
        ["Mfg date", "10th August"],
        ["Best before", "21 days"]
      ]
    },
    {
      id: "house-made-granola",
      name: "House-Made Granola",
      price: 250,
      img: "img/products/house-made-granola-thumb.jpg",
      full: "img/products/house-made-granola.jpg",
      desc: "Oven-baked granola made in our kitchen, in a resealable kraft pouch. 150g.",
      category: "Granola & Snacks",
      specs: [
        ["Net weight", "150 g"],
        ["Mfg date", "13th July"],
        ["Best before", "60 days from Mfg"],
        ["Batch no.", "001"]
      ]
    },
    {
      id: "silk-roast-makhana",
      name: "Silk Roast Makhana",
      price: 225,
      img: "img/products/silk-roast-makhana-thumb.jpg",
      full: "img/products/silk-roast-makhana.jpg",
      desc: "Crisp roasted fox nuts tossed with herbs and sesame, in a glass bottle.",
      category: "Granola & Snacks",
      specs: [
        ["Mfg date", "11th August"],
        ["Best before", "45 days"]
      ]
    }
  ];

  const CATEGORIES = ["All", "Coffee", "Seeds & Nuts", "Bites & Balls", "Granola & Snacks"];

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

  const productOverlay = document.getElementById("productOverlay");
  const productModal = document.getElementById("productModal");
  const productModalClose = document.getElementById("productModalClose");
  const productModalBody = document.getElementById("productModalBody");

  function renderFilters() {
    productFilters.innerHTML = CATEGORIES.map((cat) => `
      <button type="button" class="product_filter${cat === activeCategory ? " is-active" : ""}" data-category="${cat}">${cat}</button>
    `).join("");
  }

  function renderProducts() {
    const items = activeCategory === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory);
    productGrid.innerHTML = items.map((p, i) => `
      <div class="product_card" data-id="${p.id}" role="button" tabindex="0" aria-label="View ${p.name}" style="animation-delay:${(i % 8) * 0.06}s">
        <span class="product_card-tag">${p.category}</span>
        <div class="product_card-media">
          <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'">
          <span class="product_card-view">View product</span>
        </div>
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

  function openProductModal(id) {
    const p = productById[id];
    if (!p) return;

    const specs = (p.specs || [])
      .map(([label, value]) => `<li><span>${label}</span><span>${value}</span></li>`)
      .join("");

    productModalBody.innerHTML = `
      <div class="product_modal-media">
        <img src="${p.full || p.img}" alt="${p.name}">
      </div>
      <div class="product_modal-info">
        <span class="product_modal-tag">${p.category}</span>
        <h3 class="product_modal-name">${p.name}</h3>
        <p class="product_modal-desc">${p.desc}</p>
        ${specs ? `<ul class="product_modal-specs">${specs}</ul>` : ""}
        <div class="product_modal-footer">
          <span class="product_modal-price">${formatPrice(p.price)}</span>
          <button type="button" class="product_card-add" data-id="${p.id}">Add to Cart</button>
        </div>
      </div>
    `;

    productOverlay.classList.add("is-open");
    productModal.classList.add("is-open");
    productModal.setAttribute("aria-hidden", "false");
    lockScroll(true);
  }

  function closeProductModal() {
    productOverlay.classList.remove("is-open");
    productModal.classList.remove("is-open");
    productModal.setAttribute("aria-hidden", "true");
    if (!cartDrawer.classList.contains("is-open") && !checkoutModal.classList.contains("is-open")) lockScroll(false);
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
      if (btn) {
        addToCart(btn.dataset.id, btn);
        return;
      }
      const card = e.target.closest(".product_card");
      if (card) openProductModal(card.dataset.id);
    });

    productGrid.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const card = e.target.closest(".product_card");
      if (!card) return;
      e.preventDefault();
      openProductModal(card.dataset.id);
    });

    productModalBody.addEventListener("click", (e) => {
      const btn = e.target.closest(".product_card-add");
      if (btn) addToCart(btn.dataset.id, btn);
    });

    productModalClose.addEventListener("click", closeProductModal);
    productOverlay.addEventListener("click", closeProductModal);

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
      if (productModal.classList.contains("is-open")) closeProductModal();
      else if (checkoutModal.classList.contains("is-open")) closeCheckout();
      else if (cartDrawer.classList.contains("is-open")) closeCart();
    });
  });
})();
