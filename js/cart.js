/**
 * VELORA - Shopping Cart & Wishlist System
 * Pure Vanilla JavaScript with LocalStorage Persistence
 */

const CART_STORAGE_KEY = "velora_cart_items";
const WISHLIST_STORAGE_KEY = "velora_wishlist_items";
const COUPON_STORAGE_KEY = "velora_active_coupon";

const FREE_SHIPPING_THRESHOLD = 250;
const STANDARD_SHIPPING_FEE = 25;

const PROMO_CODES = {
  VELORA15: { discountPercent: 15, label: "15% Off VIP Welcome" },
  VIP20: { discountPercent: 20, label: "20% Off Haute Collection" },
  FREESHIP: { freeShipping: true, label: "Complimentary Worldwide Express" }
};

const VeloraCart = {
  // Read from localStorage
  getItems() {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to read cart from localStorage", e);
      return [];
    }
  },

  // Save to localStorage
  saveItems(items) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      this.updateBadgeCounts();
      this.renderCartDrawer();
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  },

  // Add Item to Cart
  addItem(productId, size, color, quantity = 1) {
    const product = VeloraProducts.getById(productId);
    if (!product) return false;

    const items = this.getItems();
    const chosenSize = size || product.sizes[0] || "Standard";
    const chosenColor = color || (product.colors && product.colors[0] ? product.colors[0].name : "Standard");
    const chosenColorHex = (product.colors && product.colors[0]) ? product.colors[0].hex : "#111111";

    const cartItemId = `${productId}-${chosenSize}-${chosenColor}`.replace(/\s+/g, "_");

    const existingIndex = items.findIndex(item => item.cartItemId === cartItemId);

    if (existingIndex > -1) {
      items[existingIndex].quantity += Number(quantity);
    } else {
      items.push({
        cartItemId,
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        categoryLabel: product.categoryLabel,
        size: chosenSize,
        color: chosenColor,
        colorHex: chosenColorHex,
        quantity: Number(quantity)
      });
    }

    this.saveItems(items);
    if (window.showToast) {
      window.showToast(`"${product.name}" added to shopping bag.`, "success");
    }
    this.openCartDrawer();
    return true;
  },

  // Update Item Quantity
  updateQuantity(cartItemId, delta) {
    let items = this.getItems();
    const itemIndex = items.findIndex(item => item.cartItemId === cartItemId);

    if (itemIndex > -1) {
      items[itemIndex].quantity += delta;
      if (items[itemIndex].quantity <= 0) {
        items.splice(itemIndex, 1);
        if (window.showToast) {
          window.showToast("Item removed from bag.", "info");
        }
      }
      this.saveItems(items);
    }
  },

  // Remove Item
  removeItem(cartItemId) {
    let items = this.getItems();
    items = items.filter(item => item.cartItemId !== cartItemId);
    this.saveItems(items);
    if (window.showToast) {
      window.showToast("Item removed from bag.", "info");
    }
  },

  // Clear Cart
  clear() {
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(COUPON_STORAGE_KEY);
    this.updateBadgeCounts();
    this.renderCartDrawer();
  },

  // Coupons
  getActiveCoupon() {
    try {
      const code = localStorage.getItem(COUPON_STORAGE_KEY);
      return code && PROMO_CODES[code] ? { code, ...PROMO_CODES[code] } : null;
    } catch (e) {
      return null;
    }
  },

  applyCoupon(code) {
    const cleanCode = (code || "").trim().toUpperCase();
    if (PROMO_CODES[cleanCode]) {
      localStorage.setItem(COUPON_STORAGE_KEY, cleanCode);
      this.renderCartDrawer();
      if (window.showToast) {
        window.showToast(`Promo code ${cleanCode} applied!`, "success");
      }
      return { success: true, message: PROMO_CODES[cleanCode].label };
    }
    return { success: false, message: "Invalid promotional code." };
  },

  removeCoupon() {
    localStorage.removeItem(COUPON_STORAGE_KEY);
    this.renderCartDrawer();
    if (window.showToast) {
      window.showToast("Promotional code removed.", "info");
    }
  },

  // Financial Calculations
  getTotals() {
    const items = this.getItems();
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const coupon = this.getActiveCoupon();

    let discount = 0;
    if (coupon && coupon.discountPercent) {
      discount = Math.round((subtotal * coupon.discountPercent) / 100);
    }

    let shipping = 0;
    if (subtotal > 0) {
      if (coupon && coupon.freeShipping) {
        shipping = 0;
      } else if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        shipping = 0;
      } else {
        shipping = STANDARD_SHIPPING_FEE;
      }
    }

    const total = Math.max(0, subtotal - discount + shipping);
    const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

    return {
      subtotal,
      discount,
      shipping,
      total,
      coupon,
      freeShippingRemaining,
      freeShippingProgress,
      itemCount: items.reduce((count, i) => count + i.quantity, 0)
    };
  },

  // Badge updates in Navbar
  updateBadgeCounts() {
    const cartCountEl = document.getElementById("cartCountBadge");
    const wishlistCountEl = document.getElementById("wishlistCountBadge");

    const cartItems = this.getItems();
    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    if (cartCountEl) {
      cartCountEl.textContent = totalCount;
      cartCountEl.style.display = totalCount > 0 ? "inline-flex" : "none";
    }

    const wishlistItems = VeloraWishlist.getItems();
    if (wishlistCountEl) {
      wishlistCountEl.textContent = wishlistItems.length;
      wishlistCountEl.style.display = wishlistItems.length > 0 ? "inline-flex" : "none";
    }
  },

  // Drawer Open/Close
  openCartDrawer() {
    const drawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("drawerOverlay");
    if (drawer && overlay) {
      this.renderCartDrawer();
      drawer.classList.add("active");
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  },

  closeCartDrawer() {
    const drawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("drawerOverlay");
    if (drawer) drawer.classList.remove("active");
    if (overlay && !document.getElementById("wishlistDrawer")?.classList.contains("active")) {
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  },

  // Render Cart Drawer HTML
  renderCartDrawer() {
    const container = document.getElementById("cartDrawerItems");
    const footer = document.getElementById("cartDrawerFooter");
    const freeShipText = document.getElementById("freeShippingText");
    const freeShipBar = document.getElementById("freeShippingBar");

    if (!container) return;

    const items = this.getItems();
    const totals = this.getTotals();

    // Progress bar for free shipping
    if (freeShipText && freeShipBar) {
      if (totals.subtotal >= FREE_SHIPPING_THRESHOLD) {
        freeShipText.innerHTML = "✨ You have qualified for <strong>Complimentary Worldwide Delivery</strong>!";
        freeShipBar.style.width = "100%";
      } else {
        freeShipText.innerHTML = `Add <strong>$${totals.freeShippingRemaining}</strong> more for Complimentary Express Shipping`;
        freeShipBar.style.width = `${totals.freeShippingProgress}%`;
      }
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-cart-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <h3>Your Shopping Bag is Empty</h3>
          <p>Indulge in our curated seasonal collection of timeless sartorial pieces.</p>
          <a href="shop.html" class="btn btn-outline" onclick="VeloraCart.closeCartDrawer()">Explore Collections</a>
        </div>
      `;
      if (footer) footer.style.display = "none";
      return;
    }

    if (footer) footer.style.display = "block";

    container.innerHTML = items.map(item => `
      <div class="cart-item" data-id="${item.cartItemId}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=300&auto=format&fit=crop'" />
        <div class="cart-item-details">
          <div class="cart-item-header">
            <h4 class="cart-item-title">${item.name}</h4>
            <button class="cart-item-remove" onclick="VeloraCart.removeItem('${item.cartItemId}')" aria-label="Remove item">
              &times;
            </button>
          </div>
          <div class="cart-item-meta">
            <span>Size: ${item.size}</span>
            <span>Color: ${item.color}</span>
          </div>
          <div class="cart-item-bottom">
            <div class="qty-stepper">
              <button onclick="VeloraCart.updateQuantity('${item.cartItemId}', -1)" aria-label="Decrease">&minus;</button>
              <span>${item.quantity}</span>
              <button onclick="VeloraCart.updateQuantity('${item.cartItemId}', 1)" aria-label="Increase">&#43;</button>
            </div>
            <div class="cart-item-price">$${item.price * item.quantity}</div>
          </div>
        </div>
      </div>
    `).join("");

    // Footer summary
    const subtotalEl = document.getElementById("cartSubtotalDisplay");
    const discountRow = document.getElementById("cartDiscountRow");
    const discountEl = document.getElementById("cartDiscountDisplay");
    const shippingEl = document.getElementById("cartShippingDisplay");
    const totalEl = document.getElementById("cartTotalDisplay");
    const couponTag = document.getElementById("activeCouponTag");

    if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal}`;
    if (shippingEl) shippingEl.textContent = totals.shipping === 0 ? "Complimentary" : `$${totals.shipping}`;
    if (totalEl) totalEl.textContent = `$${totals.total}`;

    if (discountRow && discountEl) {
      if (totals.discount > 0) {
        discountRow.style.display = "flex";
        discountEl.textContent = `-$${totals.discount}`;
      } else {
        discountRow.style.display = "none";
      }
    }

    if (couponTag) {
      if (totals.coupon) {
        couponTag.innerHTML = `
          <span>Applied: <strong>${totals.coupon.code}</strong> (${totals.coupon.label})</span>
          <button type="button" onclick="VeloraCart.removeCoupon()" title="Remove coupon">&times;</button>
        `;
        couponTag.style.display = "flex";
      } else {
        couponTag.style.display = "none";
      }
    }
  }
};

/**
 * VELORA - Wishlist System
 */
const VeloraWishlist = {
  getItems() {
    try {
      const data = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to read wishlist", e);
      return [];
    }
  },

  saveItems(items) {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
      VeloraCart.updateBadgeCounts();
      this.renderWishlistDrawer();
      this.syncWishlistButtons();
    } catch (e) {
      console.error("Failed to save wishlist", e);
    }
  },

  has(productId) {
    return this.getItems().includes(productId);
  },

  toggle(productId) {
    let items = this.getItems();
    const product = VeloraProducts.getById(productId);
    const index = items.indexOf(productId);

    if (index > -1) {
      items.splice(index, 1);
      if (window.showToast) {
        window.showToast(`Removed from wishlist.`, "info");
      }
    } else {
      items.push(productId);
      if (window.showToast && product) {
        window.showToast(`"${product.name}" saved to your wishlist.`, "success");
      }
    }

    this.saveItems(items);
  },

  moveToCart(productId) {
    const product = VeloraProducts.getById(productId);
    if (!product) return;

    VeloraCart.addItem(productId, product.sizes[0], product.colors[0]?.name, 1);
    this.toggle(productId); // Remove from wishlist
    this.closeWishlistDrawer();
    VeloraCart.openCartDrawer();
  },

  openWishlistDrawer() {
    const drawer = document.getElementById("wishlistDrawer");
    const overlay = document.getElementById("drawerOverlay");
    if (drawer && overlay) {
      this.renderWishlistDrawer();
      drawer.classList.add("active");
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  },

  closeWishlistDrawer() {
    const drawer = document.getElementById("wishlistDrawer");
    const overlay = document.getElementById("drawerOverlay");
    if (drawer) drawer.classList.remove("active");
    if (overlay && !document.getElementById("cartDrawer")?.classList.contains("active")) {
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  },

  renderWishlistDrawer() {
    const container = document.getElementById("wishlistDrawerItems");
    if (!container) return;

    const ids = this.getItems();
    const products = ids.map(id => VeloraProducts.getById(id)).filter(Boolean);

    if (products.length === 0) {
      container.innerHTML = `
        <div class="empty-cart-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <h3>Your Wishlist is Empty</h3>
          <p>Save your favorite bespoke silhouettes and curated accessories for future acquisition.</p>
          <a href="shop.html" class="btn btn-outline" onclick="VeloraWishlist.closeWishlistDrawer()">Discover Creations</a>
        </div>
      `;
      return;
    }

    container.innerHTML = products.map(product => `
      <div class="cart-item wishlist-item" data-id="${product.id}">
        <img src="${product.image}" alt="${product.name}" class="cart-item-img" />
        <div class="cart-item-details">
          <div class="cart-item-header">
            <h4 class="cart-item-title">${product.name}</h4>
            <button class="cart-item-remove" onclick="VeloraWishlist.toggle('${product.id}')" aria-label="Remove from wishlist">
              &times;
            </button>
          </div>
          <div class="cart-item-meta">
            <span>${product.categoryLabel}</span>
            <span class="wishlist-price">$${product.price}</span>
          </div>
          <div class="wishlist-actions">
            <button class="btn btn-dark btn-sm" onclick="VeloraWishlist.moveToCart('${product.id}')">
              Move to Bag
            </button>
          </div>
        </div>
      </div>
    `).join("");
  },

  syncWishlistButtons() {
    const buttons = document.querySelectorAll(".btn-wishlist-toggle");
    buttons.forEach(btn => {
      const pid = btn.getAttribute("data-product-id");
      if (this.has(pid)) {
        btn.classList.add("active");
        btn.setAttribute("title", "Remove from wishlist");
      } else {
        btn.classList.remove("active");
        btn.setAttribute("title", "Save to wishlist");
      }
    });
  }
};

// Initialize Cart and Wishlist listeners when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  VeloraCart.updateBadgeCounts();

  // Coupon form handler
  const couponForm = document.getElementById("cartCouponForm");
  if (couponForm) {
    couponForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("couponInput");
      if (input && input.value) {
        const result = VeloraCart.applyCoupon(input.value);
        if (!result.success && window.showToast) {
          window.showToast(result.message, "error");
        }
        input.value = "";
      }
    });
  }

  // Checkout modal handlers
  const checkoutBtn = document.getElementById("proceedToCheckoutBtn");
  const checkoutModal = document.getElementById("checkoutModal");
  const checkoutCloseBtn = document.getElementById("closeCheckoutModal");
  const checkoutForm = document.getElementById("veloraCheckoutForm");

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const items = VeloraCart.getItems();
      if (items.length === 0) {
        if (window.showToast) window.showToast("Your shopping bag is empty.", "info");
        return;
      }
      VeloraCart.closeCartDrawer();
      if (checkoutModal) {
        renderCheckoutOrderSummary();
        checkoutModal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  }

  if (checkoutCloseBtn && checkoutModal) {
    checkoutCloseBtn.addEventListener("click", () => {
      checkoutModal.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const btn = checkoutForm.querySelector("button[type='submit']");
      const originalText = btn.innerHTML;
      btn.innerHTML = `<span>Processing Order...</span>`;
      btn.disabled = true;

      setTimeout(() => {
        const name = document.getElementById("checkoutName")?.value || "Distinguished Client";
        const email = document.getElementById("checkoutEmail")?.value || "";
        const orderId = `VEL-${Math.floor(100000 + Math.random() * 900000)}`;
        const totals = VeloraCart.getTotals();

        // Render Order Success in Modal
        const modalBody = document.getElementById("checkoutModalBody");
        if (modalBody) {
          modalBody.innerHTML = `
            <div class="order-success-screen">
              <div class="success-icon">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#C5A880" stroke-width="1.8">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h2>Order Confirmed</h2>
              <p class="order-subtitle">Thank you, <strong>${name}</strong>. Your bespoke order has been accepted into our atelier.</p>
              
              <div class="order-receipt-card">
                <div class="receipt-row">
                  <span>Order Reference:</span>
                  <strong>${orderId}</strong>
                </div>
                <div class="receipt-row">
                  <span>Confirmation Dispatched to:</span>
                  <strong>${email}</strong>
                </div>
                <div class="receipt-row">
                  <span>Total Amount Paid:</span>
                  <strong class="receipt-amount">$${totals.total}</strong>
                </div>
                <div class="receipt-row">
                  <span>Estimated Delivery:</span>
                  <span>3-5 Business Days (Insured White-Glove Courier)</span>
                </div>
              </div>

              <div class="order-success-actions">
                <a href="shop.html" class="btn btn-dark" onclick="location.reload()">Continue Shopping</a>
                <button type="button" class="btn btn-outline" onclick="window.print()">Print Atelier Invoice</button>
              </div>
            </div>
          `;
        }

        VeloraCart.clear();
        if (window.showToast) {
          window.showToast(`Order ${orderId} placed successfully!`, "success");
        }
      }, 1200);
    });
  }
});

function renderCheckoutOrderSummary() {
  const container = document.getElementById("checkoutSummaryItems");
  const totalsEl = document.getElementById("checkoutSummaryTotals");
  if (!container || !totalsEl) return;

  const items = VeloraCart.getItems();
  const totals = VeloraCart.getTotals();

  container.innerHTML = items.map(item => `
    <div class="checkout-item-line">
      <img src="${item.image}" alt="${item.name}" />
      <div class="checkout-item-text">
        <h5>${item.name}</h5>
        <small>Qty: ${item.quantity} | Size: ${item.size}</small>
      </div>
      <div class="checkout-item-price">$${item.price * item.quantity}</div>
    </div>
  `).join("");

  totalsEl.innerHTML = `
    <div class="summary-line">
      <span>Subtotal</span>
      <span>$${totals.subtotal}</span>
    </div>
    ${totals.discount > 0 ? `
      <div class="summary-line discount-text">
        <span>Promotional Privilege</span>
        <span>-$${totals.discount}</span>
      </div>
    ` : ""}
    <div class="summary-line">
      <span>White Glove Shipping</span>
      <span>${totals.shipping === 0 ? "Complimentary" : `$${totals.shipping}`}</span>
    </div>
    <div class="summary-line total-line">
      <span>Total (USD)</span>
      <span>$${totals.total}</span>
    </div>
  `;
}
