# VELORA — Haute Couture & Prêt-à-Porter

An ultra-premium, modern luxury fashion e-commerce website crafted exclusively with **HTML5, CSS3, and Vanilla JavaScript**.

Designed with architectural minimalism, slow-fashion aesthetics, and a fluid client concierge experience inspired by heritage European ateliers (Milan, Paris, Lyon).

---

## 🏛️ Strict Technology Architecture

This project strictly adheres to pure foundational web standards:

- **Markup**: Semantic **HTML5**
- **Styling**: Modern **CSS3** (CSS Custom Properties, Flexbox, CSS Grid, Transitions, Keyframe Animations, Responsive Media Queries)
- **Scripting**: Pure **Vanilla JavaScript** (ES6+, DOM Manipulation, LocalStorage, SessionStorage)
- **Zero Dependencies**:
  - ❌ No React, Vue, Angular, or frontend frameworks
  - ❌ No Node.js, PHP, Python, or backend runtimes
  - ❌ No Bootstrap, Tailwind, or CSS frameworks
  - ❌ No jQuery, Lodash, or third-party JS libraries
  - ❌ No Vite, Webpack, Babel, npm, or build tools

---

## 📂 Project Structure

```text
VELORA/
│
├── html/
│   ├── index.html      # Cinematic editorial home page & featured showcases
│   ├── shop.html       # Full wardrobe catalogue with interactive filtering & sorting
│   ├── about.html      # Atelier story, sustainable values, & milestone timeline
│   └── contact.html    # Client Concierge form with real-time validation & boutique FAQ
│
├── css/
│   └── style.css       # Complete luxury styling, tokens, modals, and responsive layout
│
├── js/
│   ├── products.js     # Curated inventory dataset & search/filter methods
│   ├── cart.js         # Shopping bag, wishlist, coupons, & checkout simulation
│   ├── chatbot.js      # External luxury concierge AI styling assistant
│   └── script.js       # Global UI controls, quick-view, search, & form validation
│
├── images/             # Vector branding & fallback assets
│   ├── logo.svg
│   └── product-placeholder.svg
│
└── README.md           # Project documentation and setup guide
```

---

## 🚀 How to Run the Website

You do **not** need to install any packages, run any terminal servers, or compile files.

### Method 1: Direct File Launch (Easiest)
1. Navigate to the project directory:
   ```
   D:\WEB TECH\web tech micro project\html\
   ```
2. Double-click **`index.html`** to open it directly in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari, Brave).

### Method 2: VS Code Live Server
1. Open the folder `web tech micro project` in **Visual Studio Code**.
2. Navigate into the `html/` folder.
3. Right-click on **`index.html`** and select **"Open with Live Server"**.
4. The website will launch automatically at `http://127.0.0.1:5500/html/index.html`.

---

## ✨ Implemented Features

### 1. Curated Product Catalogue (`js/products.js`)
- Rich inventory featuring bespoke Outerwear, Mulberry Silk Eveningwear, Fine Wool Tailoring, Recycled Cashmere Knitwear, Tuscan Leather Bags, and 18K Gold Vermeil Jewelry.
- Comprehensive specifications: multi-angle galleries, proportions/sizes, color palettes with hex values, stock status, ratings, and artisanal fabrication notes.

### 2. Multi-Faceted Filter & Search (`html/shop.html`, `js/script.js`)
- **Category Filter**: Filter instantaneously by Outerwear, Silk Dresses, Tailoring, Cashmere Knitwear, Tops, Accessories, and Footwear.
- **Price Range Slider**: Dynamic slider filtering acquisitions between $150 and $1,200 with live dollar value readout.
- **Size Filter Pills**: Filter items available in XS, S, M, L, XL, One Size, 38, or 40.
- **Availability Toggle**: Show items ready for immediate dispatch.
- **Multi-criteria Sorting**: Sort by Featured Atelier Order, Price (Low to High), Price (High to Low), Customer Rating, and Alphabetical.
- **In-Catalog Search**: Real-time keyword filter across names and descriptions.
- **Clear All Filters**: One-click reset to default catalog view.

### 3. Shopping Bag & Checkout (`js/cart.js`)
- **LocalStorage Persistence**: Bag contents are preserved across browser refreshes and page navigation under `velora_cart_items`.
- **Free Shipping Progress Tracker**: Visual progress bar showing distance to the $250 Complimentary Worldwide Express Delivery threshold.
- **Quantity Stepper & Item Deletion**: Real-time price and subtotal recalculation.
- **Promotional Privilege System**:
  - `VELORA15` &rarr; 15% Off VIP Welcome
  - `VIP20` &rarr; 20% Off Haute Collection
  - `FREESHIP` &rarr; Complimentary Worldwide Delivery
- **Full Checkout Simulation**: Captures client information, validates inputs, generates an atelier reference number (e.g., `VEL-582914`), and displays a printable invoice receipt.

### 4. Saved Wishlist System (`js/cart.js`, `js/script.js`)
- Persistent wishlist stored in `localStorage` under `velora_wishlist_items`.
- Dynamic heart toggle button on every product card with active states.
- Dedicated slide-out Wishlist Drawer with a one-click **"Move to Bag"** action.

### 5. Interactive Quick View Modal (`js/script.js`)
- Clicking "Quick View" on any product opens an editorial dialog without leaving the page.
- Select among available palette color swatches, proportion sizes, and quantity before adding directly to bag or wishlist.

### 6. Global Live Search (`js/script.js`)
- Triggerable via the magnifying glass icon or keyboard interaction.
- Instant search tray filtering through all atelier creations with debounced keystrokes.

### 7. External Luxury Concierge Chatbot (`js/chatbot.js`)
- Self-mounting luxury chat widget with notification badge and sound/haptic visual cues.
- **Intelligent Keyword Engine**:
  - *Sizing & Fit*: Guidance on European draping, true-to-size recommendations, and tailoring measurements.
  - *Shipping & Logistics*: International courier speeds and white-glove delivery requirements.
  - *Order Tracking*: Recognizes reference numbers (e.g., `VEL-749102`) and provides realistic transit milestones.
  - *Returns & Exchanges*: 30-day complimentary courier pickup policies.
  - *Product Recommendations*: Suggests evening dresses, outerwear, and accessories by embedding **interactive product cards** directly into the chat flow!
  - *Promotional Codes*: Distributes VIP privilege codes.
- **Quick Reply Chips**: Tap-to-inquire buttons that make conversations effortless.
- **Typing Indicator**: Realistic 700ms concierge typing animation.
- **Session Persistence**: Chat history persists across page navigation in `sessionStorage`.

### 8. Client Concierge Form Validation (`html/contact.html`, `js/script.js`)
- Real-time client-side validation for name length, valid email syntax via regex, department selection, and detailed message body.
- Animated loading transmission state and customized confirmation response.
- Interactive FAQ accordions with smooth expandable animations.

---

## 🎨 Design System

- **Primary Noir / Obsidian**: `#111111`, `#181818`
- **Alabaster & Sand Surface**: `#FDFBF7`, `#F7F4EE`, `#E8E3DA`
- **Champagne Gold Accents**: `#C5A880`, `#D4AF37`
- **Typography**: Editorial Serif (`Playfair Display`, `Cormorant Garamond`, `Didot`) paired with Crisp Sans-Serif (`Plus Jakarta Sans`, `Inter`).
- **Responsive Layout**: Designed for seamless fluidity across Desktop (1440px+), Laptops (1024px), Tablets (768px), and Mobile devices (375px+).

---

## 📄 License & Attribution

Designed and developed for the **Web Technology Micro Project**.  
All photography referenced is licensed for high-quality open web presentation via Unsplash editorial fashion archives.
