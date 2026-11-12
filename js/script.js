/**
 * VELORA - Haute Couture & Prêt-à-Porter
 * Global Client Script & Interactive Controllers (Vanilla JavaScript)
 */

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMobileNav();
  initSearchModal();
  initQuickViewModal();
  initOverlayDismiss();

  // Page-specific initializers
  if (document.getElementById("featuredProductsGrid")) {
    initHomePage();
  }

  if (document.getElementById("shopProductsGrid")) {
    initShopPage();
  }

  if (document.getElementById("contactForm")) {
    initContactPage();
  }

  if (document.querySelector(".faq-accordion")) {
    initFaqAccordion();
  }
});

/* ==========================================================================
   1. Toast Notification System
   ========================================================================== */
window.showToast = function (message, type = "info") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `velora-toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 400);
  }, 3200);
};

/* ==========================================================================
   2. Header & Sticky Scroll
   ========================================================================== */
function initHeader() {
  const header = document.querySelector(".main-header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }, { passive: true });
}

/* ==========================================================================
   3. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const hamburger = document.getElementById("hamburgerBtn");
  const mobileDrawer = document.getElementById("mobileNavDrawer");
  const closeBtn = document.getElementById("closeMobileNav");
  const overlay = document.getElementById("drawerOverlay");

  if (!hamburger || !mobileDrawer) return;

  function openMobileNav() {
    mobileDrawer.classList.add("active");
    if (overlay) overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeMobileNav() {
    mobileDrawer.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", openMobileNav);
  if (closeBtn) closeBtn.addEventListener("click", closeMobileNav);
}

/* ==========================================================================
   4. Overlay Dismiss Handler
   ========================================================================== */
function initOverlayDismiss() {
  const overlay = document.getElementById("drawerOverlay");
  if (!overlay) return;

  overlay.addEventListener("click", () => {
    VeloraCart.closeCartDrawer();
    VeloraWishlist.closeWishlistDrawer();
    document.getElementById("mobileNavDrawer")?.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  });
}

/* ==========================================================================
   5. Global Quick View Modal
   ========================================================================== */
let currentQuickViewProduct = null;
let selectedQuickViewSize = null;
let selectedQuickViewColor = null;
let selectedQuickViewQty = 1;

function initQuickViewModal() {
  const modal = document.getElementById("quickViewModal");
  const closeBtn = document.getElementById("closeQuickViewModal");

  if (!modal) return;

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Attach global keyboard listener for Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modal.classList.remove("active");
      document.getElementById("searchModal")?.classList.remove("active");
      document.getElementById("checkoutModal")?.classList.remove("active");
      VeloraCart.closeCartDrawer();
      VeloraWishlist.closeWishlistDrawer();
      document.body.style.overflow = "";
    }
  });
}

window.openQuickView = function (productId) {
  const product = VeloraProducts.getById(productId);
  if (!product) return;

  currentQuickViewProduct = product;
  selectedQuickViewSize = product.sizes[0] || "Standard";
  selectedQuickViewColor = product.colors && product.colors[0] ? product.colors[0].name : "Standard";
  selectedQuickViewQty = 1;

  const modal = document.getElementById("quickViewModal");
  const dialog = document.getElementById("quickViewDialog");
  if (!modal || !dialog) return;

  dialog.innerHTML = `
    <button class="modal-close-btn" id="closeQuickViewModal" aria-label="Close dialog">&times;</button>
    <div class="quickview-layout">
      <div class="quickview-media">
        <img id="qvMainImg" src="${product.image}" alt="${product.name}" class="quickview-main-img" />
        ${product.gallery && product.gallery.length > 1 ? `
          <div style="display:flex; gap:0.5rem; overflow-x:auto;">
            ${product.gallery.map(img => `
              <img src="${img}" style="width:55px; height:70px; object-fit:cover; cursor:pointer; border:1px solid #CCC;" onclick="document.getElementById('qvMainImg').src='${img}'" />
            `).join("")}
          </div>
        ` : ''}
      </div>

      <div class="quickview-details">
        <div>
          <span class="eyebrow">${product.categoryLabel}</span>
          <h2 class="quickview-title">${product.name}</h2>
          <div class="quickview-price-row">
            <span class="price">$${product.price}</span>
            ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
            <span style="font-size:0.8rem; color:var(--color-gold); margin-left:auto;">
              ★ ${product.rating} (${product.reviewCount} client reviews)
            </span>
          </div>
          <p class="quickview-desc">${product.description}</p>

          <!-- Colors -->
          ${product.colors && product.colors.length > 0 ? `
            <div class="option-selector-group">
              <span class="option-label">Atelier Palette: <strong id="qvColorName">${selectedQuickViewColor}</strong></span>
              <div class="swatch-picker">
                ${product.colors.map((c, idx) => `
                  <button type="button" class="swatch-circle ${idx === 0 ? 'active' : ''}" style="background-color:${c.hex};" title="${c.name}" onclick="selectQvColor('${c.name}', this)"></button>
                `).join("")}
              </div>
            </div>
          ` : ''}

          <!-- Sizes -->
          <div class="option-selector-group">
            <span class="option-label">Select Proportion:</span>
            <div class="size-pill-grid">
              ${product.sizes.map((s, idx) => `
                <button type="button" class="size-pill ${idx === 0 ? 'active' : ''}" onclick="selectQvSize('${s}', this)">${s}</button>
              `).join("")}
            </div>
          </div>

          <!-- Quantity -->
          <div class="option-selector-group" style="display:flex; align-items:center; gap:1rem;">
            <span class="option-label" style="margin-bottom:0;">Quantity:</span>
            <div class="qty-stepper">
              <button onclick="updateQvQty(-1)">&minus;</button>
              <span id="qvQtyDisplay">1</span>
              <button onclick="updateQvQty(1)">&#43;</button>
            </div>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:0.75rem; margin-top:1.5rem;">
          <button class="btn btn-dark btn-block" onclick="submitQuickViewCart()">Add to Shopping Bag</button>
          <button class="btn btn-outline btn-block" onclick="VeloraWishlist.toggle('${product.id}'); updateQvWishlistState(this);">
            ${VeloraWishlist.has(product.id) ? 'Saved in Wishlist ★' : 'Save to Wishlist ♡'}
          </button>
        </div>
      </div>
    </div>
  `;

  // Re-bind close button inside
  document.getElementById("closeQuickViewModal").addEventListener("click", () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  });

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
};

window.selectQvColor = function (colorName, element) {
  selectedQuickViewColor = colorName;
  const nameEl = document.getElementById("qvColorName");
  if (nameEl) nameEl.textContent = colorName;
  document.querySelectorAll(".swatch-picker .swatch-circle").forEach(c => c.classList.remove("active"));
  element.classList.add("active");
};

window.selectQvSize = function (size, element) {
  selectedQuickViewSize = size;
  document.querySelectorAll(".size-pill-grid .size-pill").forEach(s => s.classList.remove("active"));
  element.classList.add("active");
};

window.updateQvQty = function (delta) {
  selectedQuickViewQty = Math.max(1, selectedQuickViewQty + delta);
  const display = document.getElementById("qvQtyDisplay");
  if (display) display.textContent = selectedQuickViewQty;
};

window.submitQuickViewCart = function () {
  if (!currentQuickViewProduct) return;
  VeloraCart.addItem(
    currentQuickViewProduct.id,
    selectedQuickViewSize,
    selectedQuickViewColor,
    selectedQuickViewQty
  );
  document.getElementById("quickViewModal")?.classList.remove("active");
  document.body.style.overflow = "";
};

window.updateQvWishlistState = function (btn) {
  if (!currentQuickViewProduct) return;
  const hasItem = VeloraWishlist.has(currentQuickViewProduct.id);
  btn.textContent = hasItem ? 'Saved in Wishlist ★' : 'Save to Wishlist ♡';
};

/* ==========================================================================
   6. Global Search Overlay
   ========================================================================== */
function initSearchModal() {
  const trigger = document.getElementById("searchTriggerBtn");
  const modal = document.getElementById("searchModal");
  const closeBtn = document.getElementById("closeSearchModal");
  const input = document.getElementById("globalSearchInput");
  const tray = document.getElementById("searchResultsTray");

  if (!modal || !trigger) return;

  function openSearch() {
    modal.classList.add("active");
    input.value = "";
    renderSearchResults("");
    setTimeout(() => input.focus(), 100);
    document.body.style.overflow = "hidden";
  }

  function closeSearch() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  trigger.addEventListener("click", openSearch);
  if (closeBtn) closeBtn.addEventListener("click", closeSearch);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeSearch();
  });

  if (input) {
    input.addEventListener("input", (e) => {
      renderSearchResults(e.target.value);
    });
  }

  function renderSearchResults(query) {
    if (!tray) return;

    const filtered = VeloraProducts.filter({ search: query });

    if (filtered.length === 0) {
      tray.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; color: #FFF; padding: 2rem;">
          <p style="font-size: 1.1rem;">No atelier pieces matched your query.</p>
          <small style="color: #A09A8F;">Try searching for "silk", "coat", "cashmere", or "tote".</small>
        </div>
      `;
      return;
    }

    tray.innerHTML = filtered.map(p => `
      <div class="product-card" style="background:#FFF; padding:0.8rem;">
        <div class="product-media-wrap" style="aspect-ratio:3/4; margin-bottom:0.5rem;">
          <img src="${p.image}" alt="${p.name}" />
        </div>
        <div class="product-info">
          <span class="product-category-tag">${p.categoryLabel}</span>
          <h4 class="product-name" style="font-size:0.95rem;">${p.name}</h4>
          <span class="price" style="font-weight:600; font-size:0.9rem;">$${p.price}</span>
          <button class="btn btn-dark btn-sm" style="margin-top:0.5rem;" onclick="openQuickView('${p.id}'); closeSearch();">Quick View</button>
        </div>
      </div>
    `).join("");
  }
}

/* ==========================================================================
   7. Home Page Specific Logic
   ========================================================================== */
function initHomePage() {
  const container = document.getElementById("featuredProductsGrid");
  if (!container) return;

  const featured = VeloraProducts.getFeatured();

  container.innerHTML = featured.map(p => createProductCardHTML(p)).join("");
  VeloraWishlist.syncWishlistButtons();

  // VIP Newsletter Form
  const newsletterForm = document.getElementById("homeNewsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector("input[type='email']");
      if (emailInput && emailInput.value) {
        showToast(`Privilege Pass granted to ${emailInput.value}! Code VELORA15 ready for use.`, "success");
        emailInput.value = "";
      }
    });
  }
}

/* ==========================================================================
   8. Shop Page Specific Filtering & Sorting
   ========================================================================== */
function initShopPage() {
  const container = document.getElementById("shopProductsGrid");
  const countEl = document.getElementById("shopResultsCount");
  const priceSlider = document.getElementById("priceSlider");
  const maxPriceDisplay = document.getElementById("maxPriceDisplay");
  const searchInput = document.getElementById("shopSearchInput");
  const sortSelect = document.getElementById("shopSortSelect");
  const inStockCheckbox = document.getElementById("inStockOnlyCheckbox");
  const clearBtn = document.getElementById("clearFiltersBtn");

  if (!container) return;

  // Filter state
  let currentFilters = {
    category: "all",
    maxPrice: priceSlider ? Number(priceSlider.value) : 1200,
    size: null,
    inStockOnly: false,
    search: "",
    sortBy: "featured"
  };

  function applyFiltersAndRender() {
    const products = VeloraProducts.filter(currentFilters);

    if (countEl) {
      countEl.textContent = `Showing ${products.length} of ${VeloraProducts.getAll().length} Creations`;
    }

    if (products.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <h3 style="font-size:1.4rem; margin-bottom:0.5rem;">No Matching Pieces Found</h3>
          <p style="color:var(--color-text-muted); font-size:0.9rem; margin-bottom:1.5rem;">
            Please refine your filter preferences or reset parameters to explore our entire repertoire.
          </p>
          <button class="btn btn-dark" onclick="document.getElementById('clearFiltersBtn').click()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML = products.map(p => createProductCardHTML(p)).join("");
    VeloraWishlist.syncWishlistButtons();
  }

  // Category filter handlers
  const categoryRadios = document.querySelectorAll("input[name='shopCategory']");
  categoryRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      currentFilters.category = e.target.value;
      applyFiltersAndRender();
    });
  });

  // Price slider
  if (priceSlider && maxPriceDisplay) {
    priceSlider.addEventListener("input", (e) => {
      const val = Number(e.target.value);
      maxPriceDisplay.textContent = `$${val}`;
      currentFilters.maxPrice = val;
      applyFiltersAndRender();
    });
  }

  // Size pill buttons
  const sizePills = document.querySelectorAll(".shop-size-pill");
  sizePills.forEach(pill => {
    pill.addEventListener("click", () => {
      const size = pill.getAttribute("data-size");
      if (currentFilters.size === size) {
        currentFilters.size = null;
        pill.classList.remove("active");
      } else {
        sizePills.forEach(p => p.classList.remove("active"));
        currentFilters.size = size;
        pill.classList.add("active");
      }
      applyFiltersAndRender();
    });
  });

  // In Stock Checkbox
  if (inStockCheckbox) {
    inStockCheckbox.addEventListener("change", (e) => {
      currentFilters.inStockOnly = e.target.checked;
      applyFiltersAndRender();
    });
  }

  // Search Input in Shop
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentFilters.search = e.target.value;
      applyFiltersAndRender();
    });
  }

  // Sort Select
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentFilters.sortBy = e.target.value;
      applyFiltersAndRender();
    });
  }

  // Clear Filters
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      currentFilters = {
        category: "all",
        maxPrice: 1200,
        size: null,
        inStockOnly: false,
        search: "",
        sortBy: "featured"
      };

      // Reset inputs in DOM
      const allCat = document.getElementById("catAll");
      if (allCat) allCat.checked = true;

      if (priceSlider) {
        priceSlider.value = 1200;
        if (maxPriceDisplay) maxPriceDisplay.textContent = "$1200";
      }

      sizePills.forEach(p => p.classList.remove("active"));

      if (inStockCheckbox) inStockCheckbox.checked = false;
      if (searchInput) searchInput.value = "";
      if (sortSelect) sortSelect.value = "featured";

      applyFiltersAndRender();
      showToast("Filters reset to default view.", "info");
    });
  }

  // Initial render
  applyFiltersAndRender();
}

/* ==========================================================================
   9. Contact Form Real-Time Validation
   ========================================================================== */
function initContactPage() {
  const form = document.getElementById("contactForm");
  const msgBox = document.getElementById("contactFormStatus");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("contactName")?.value.trim();
    const email = document.getElementById("contactEmail")?.value.trim();
    const subject = document.getElementById("contactSubject")?.value.trim();
    const message = document.getElementById("contactMessage")?.value.trim();

    // Clear previous errors
    if (msgBox) {
      msgBox.className = "contact-form-message";
      msgBox.textContent = "";
    }

    // Validation rules
    if (!name || name.length < 2) {
      showError("Please enter your full name (at least 2 characters).");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      showError("Please enter a valid email address.");
      return;
    }

    if (!subject) {
      showError("Please select an inquiry department.");
      return;
    }

    if (!message || message.length < 10) {
      showError("Please elaborate on your inquiry (at least 10 characters).");
      return;
    }

    // Submit Simulation
    const submitBtn = form.querySelector("button[type='submit']");
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = "<span>Transmitting to Atelier...</span>";
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

      if (msgBox) {
        msgBox.className = "contact-form-message success";
        msgBox.innerHTML = `<strong>Inquiry Received.</strong> Dear ${name}, your bespoke request has been assigned to our senior client stylist. You will receive a personal response at <strong>${email}</strong> within 12 hours.`;
      }

      form.reset();
      showToast("Client inquiry dispatched successfully.", "success");
    }, 1200);
  });

  function showError(text) {
    if (msgBox) {
      msgBox.className = "contact-form-message error";
      msgBox.textContent = text;
    }
    showToast(text, "error");
  }
}

/* ==========================================================================
   10. Interactive FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll(".faq-item");

  items.forEach(item => {
    const trigger = item.querySelector(".faq-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      // Close all other accordions for sleek exclusive feel
      items.forEach(i => i.classList.remove("active"));

      if (!isOpen) {
        item.classList.add("active");
      }
    });
  });
}

/* ==========================================================================
   11. Reusable Product Card HTML Template
   ========================================================================== */
function createProductCardHTML(product) {
  const isWishlisted = VeloraWishlist.has(product.id);

  return `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-media-wrap">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        
        <button 
          type="button" 
          class="btn-wishlist-toggle ${isWishlisted ? 'active' : ''}" 
          data-product-id="${product.id}"
          onclick="VeloraWishlist.toggle('${product.id}')"
          aria-label="Save to Wishlist"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        <img 
          src="${product.image}" 
          alt="${product.name}" 
          loading="lazy" 
          onerror="this.src='https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop'"
        />

        <div class="product-actions-hover">
          <button type="button" class="btn-quick-action" onclick="openQuickView('${product.id}')">
            Quick View
          </button>
          <button type="button" class="btn-quick-action" onclick="VeloraCart.addItem('${product.id}', '${product.sizes[0]}', '${product.colors[0]?.name}', 1)">
            + Add to Bag
          </button>
        </div>
      </div>

      <div class="product-info">
        <span class="product-category-tag">${product.categoryLabel}</span>
        <h4 class="product-name">
          <a href="javascript:void(0)" onclick="openQuickView('${product.id}')">${product.name}</a>
        </h4>
        <div class="product-price-row">
          <span class="price">$${product.price}</span>
          ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
        </div>

        ${product.colors && product.colors.length > 0 ? `
          <div class="product-swatches">
            ${product.colors.map(c => `
              <span class="color-swatch-dot" style="background-color:${c.hex};" title="${c.name}"></span>
            `).join("")}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}
