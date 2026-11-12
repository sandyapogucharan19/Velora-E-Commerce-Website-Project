# VELORA — Haute Couture & Prêt-à-Porter
## Academic Coursework Project | Course: 25CS208 Web Technology (IA-3)

An ultra-premium, modern luxury fashion storefront crafted exclusively using **HTML5, CSS3, and Vanilla JavaScript (ES6+)**. 

Adheres strictly to zero external dependencies, frameworks, libraries, runtimes, or build tools. Runs instantly in any standard browser or via VS Code Live Server / Vercel.

---

## 🏛️ Strict Technology Architecture

- **Markup**: Pure **HTML5** (Semantic elements: `<header>`, `<nav>`, `<main>`, `<aside>`, `<section>`, `<article>`, `<footer>`, ARIA dialogs)
- **Styling**: Modern **CSS3**
  - Modular split: `css/styles.css` (semantic light/dark tokens, base styles, UI components) and `css/layout.css` (flexbox, CSS Grid layouts, and all responsive media queries)
  - Full **Dark Mode** support powered by CSS custom property tokens and persisted in `localStorage`
- **Scripting**: Pure **Vanilla JavaScript (ES6+)**
  - No React, Angular, Vue, Node.js, PHP, Python, jQuery, Bootstrap, or Tailwind
  - No build steps, bundlers, npm, or transpilers
  - All features (Cart, Wishlist, Product Catalog, Search, Filters, Live Regex Validation, Theme Switcher, AI Chatbot, Safe Calculator) are implemented in pure vanilla JS

---

## 📂 Repository File Structure (Optimized for Vercel Root Routing)

```text
VELORA/
│
├── index.html              # FR-01: Editorial storefront, hero CTA, features, theme toggle
├── register.html           # FR-02: Client enrollment with real-time regex form validation
├── signup.html             # FR-03: Simplified account creation with ToS consent
├── signin.html             # FR-04: Patron portal sign-in with password reveal & demo auth
├── home.html               # FR-05: Patron dashboard (Desktop 3-column grid & mobile flex)
├── shop.html               # Wardrobe catalogue with category, price, stock, & size filters
├── about.html              # Heritage story, sustainability pillars, & milestone timeline
├── contact.html            # Client concierge desk, boutique locator, & FAQ accordions
│
├── css/
│   ├── styles.css          # Design tokens (light/dark), reset, UI components, modals
│   └── layout.css          # Page grid layouts, flex containers, and media queries
│
├── js/
│   ├── products.js         # Curated inventory dataset & search/filter methods
│   ├── cart.js             # Shopping bag, wishlist, promotions, & checkout simulation
│   ├── validation.js       # FR-02/03/04: Real-time regex validation & demo auth session
│   ├── theme.js            # FR-07: Light/Dark theme engine with localStorage & OS detection
│   ├── calculator.js       # FR-08: Safe arithmetic tokenizer & parser without eval()
│   ├── chatbot.js          # FR-06: Word-boundary keyword concierge chatbot & demo tracker
│   └── script.js           # Global UI interactions, URL param router, quick view
│
├── images/                 # SVG brand assets
│   ├── logo.svg
│   └── product-placeholder.svg
│
├── vercel.json             # Minimal Vercel static deployment configuration
├── TESTING.md              # Comprehensive regex test matrix, viewport tests, & FR audit
└── README.md               # Project documentation & deployment manual
```

---

## 🚀 How to Run the Website

### Method 1: Direct File Launch (No Server Needed)
1. Navigate into the repository directory.
2. Double-click `index.html` to open directly in Google Chrome, Microsoft Edge, Mozilla Firefox, or Apple Safari.
3. Every feature—including cart, wishlist, theme switching, validation, and calculator—works entirely client-side.

### Method 2: VS Code Live Server
1. Open the project folder in **Visual Studio Code**.
2. Right-click `index.html` and click **"Open with Live Server"**.
3. The site opens at `http://127.0.0.1:5500/index.html`.

### Method 3: Deploy to Vercel (1-Click Static)
1. Push this repository to GitHub.
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository (`velro`).
4. Configure Project Settings:
   - **Framework Preset**: Select **"Other"**
   - **Build Command**: Leave **Empty** (toggle off override)
   - **Output Directory**: Leave **Empty** (defaults to root `.`)
   - **Install Command**: Leave **Empty**
5. Click **"Deploy"**. The site will be live immediately with clean root URLs (`/`, `/shop.html`, `/register.html`, etc.).

---

## 📋 Course 25CS208 IA-3 Deliverables Checklist

| ID | Specification | Status | Implementation Details |
|---|---|---|---|
| **FR-01** | Header with brand logo, section nav links, theme toggle, hero with CTA, product cards, responsive layout | ✅ Complete | In `index.html`, `css/styles.css`, `css/layout.css` |
| **FR-02** | Registration page (`register.html`) with exact regex rules, inline errors, blur validation, disabled submit | ✅ Complete | In `register.html`, `js/validation.js` |
| **FR-03** | Simplified sign up (`signup.html`) with email, password, and Terms of Service consent checkbox | ✅ Complete | In `signup.html`, `js/validation.js` |
| **FR-04** | Sign in (`signin.html`) with password reveal eye button, dynamic error alert banner, demo session | ✅ Complete | In `signin.html`, `js/validation.js` |
| **FR-05** | Home dashboard (`home.html`) with Desktop 3-column grid (`250px 1fr 300px`) and Mobile flex column | ✅ Complete | In `home.html`, `css/layout.css` |
| **FR-06** | Concierge Chatbot (`js/chatbot.js`) with word-boundary matching, `.user-msg`/`.bot-msg`, auto-scroll | ✅ Complete | In `js/chatbot.js` |
| **FR-07** | Theme Engine (`js/theme.js`) with header toggle button on every page, `:root` vs `[data-theme="dark"]` tokens | ✅ Complete | In `js/theme.js`, `css/styles.css` |
| **FR-08** | Safe Client Calculator (`js/calculator.js`) without `eval()` or `Function()`, division-by-zero handling, keyboard support | ✅ Complete | In `js/calculator.js`, `home.html` |

---

## 🔍 Validation Rules (FR-02)

Every registration field is verified using strict regular expressions and real-time event listeners:

1. **Full Name** (`id="fullName"`):
   - Regex: `/^[a-zA-Z\s]{2,50}$/`
   - Accepts 2 to 50 alphabetical letters and spaces.
2. **Employee / Register ID** (`id="empId"`):
   - Regex: `/^[A-Z0-9]{6,12}$/i`
   - Accepts 6 to 12 alphanumeric characters (case-insensitive).
3. **Email Address** (`id="email"`):
   - Regex: `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`
   - Standard RFC-compliant email address format.
4. **Mobile Number** (`id="mobile"`):
   - Regex: `/^[6-9]\d{9}$/`
   - Exactly 10 digits starting with 6, 7, 8, or 9.
5. **Division / Salon** (`id="dept"`):
   - Condition: `value !== ""` (must select an active salon division).
6. **Security Password** (`id="password"`):
   - Regex: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/`
   - Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special symbol (`@$!%*?&`).
7. **Confirm Password** (`id="confirmPassword"`):
   - Condition: Must exactly match `password.value`. Validation automatically re-synchronizes when the primary password field changes.

---

## 🧮 Safe Calculator Engine (FR-08)

The client calculator (`#calculatorWidget`) built for the patron portal strictly complies with academic security rules:
- **Zero Use of `eval()` or `Function()`**: Built using an explicit lexical tokenizer and two-pass operator-precedence reduction (`*` and `/` evaluated before `+` and `-`).
- **Division by Zero Protection**: Specifically catches `n / 0` and presents `"Cannot divide by zero"`.
- **Syntax Error Handling**: Malformed expressions result in `"Error"`.
- **State Recovery**: Clicking `C` or typing `c`/`Escape` safely restores the display to `0`.
- **Keyboard Support**: Listens for `0-9`, `+`, `-`, `*`, `/`, `.`, `Enter`, `=`, `Backspace`, and `c`.

---

## 🔒 Demo Authentication & Security Disclaimer

For academic evaluation purposes, user accounts created on `register.html` or `signup.html` are stored in client-side `localStorage` under `velora_users`. A pre-seeded evaluation account is ready for testing:
- **Email**: `client@velora.com`
- **Password**: `Password@123`

*Note: In production applications, authentication must be executed on a hardened server over TLS/HTTPS with salted cryptographic password hashing (e.g., Argon2/bcrypt) and secure session tokens.*

---

## 📄 Documentation

- Detailed validation test matrix, cross-viewport audit results, and feature mapping can be reviewed in [TESTING.md](TESTING.md).
