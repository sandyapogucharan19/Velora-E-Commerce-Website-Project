# VELORA — Quality Assurance & Testing Report
## Course 25CS208: Web Technology (Academic Evaluation IA-3)

This report documents the verification, regex test matrix, cross-device viewport responsiveness audit, and functional requirements traceability for the VELORA luxury fashion web application.

---

## 1. Regex Validation Test Matrix (FR-02)

Every form field in `register.html` is dynamically validated in real-time (on field blur and input events) and enforced before form dispatch. Below is the test matrix:

| Field Name | Element ID | Validation Rule / Regular Expression | Valid Test Sample | Invalid Test Sample | Failure Reason | Expected Behavior | Status |
|---|---|---|---|---|---|---|---|
| **Full Name** | `fullName` | `/^[a-zA-Z\s]{2,50}$/` | `Eleanor Vance` | `E` | Length < 2 characters | Highlight red border (`.invalid`), display `<span class="error-msg">`, submit disabled | **PASS** |
| **Full Name** | `fullName` | `/^[a-zA-Z\s]{2,50}$/` | `Jean Paul Gaultier` | `Elena123` | Contains digits | Highlight red border, error shown | **PASS** |
| **Full Name** | `fullName` | `/^[a-zA-Z\s]{2,50}$/` | `Anne Marie` | `A@ne` | Contains illegal symbols (`@`) | Highlight red border, error shown | **PASS** |
| **Register / ID** | `empId` | `/^[A-Z0-9]{6,12}$/i` | `VEL884291` | `V12` | Length < 6 characters | Highlight red border, error shown | **PASS** |
| **Register / ID** | `empId` | `/^[A-Z0-9]{6,12}$/i` | `PARIS2026` | `PARIS-2026!` | Contains hyphens and exclamation mark | Highlight red border, error shown | **PASS** |
| **Register / ID** | `empId` | `/^[A-Z0-9]{6,12}$/i` | `EMP998877665` | `EMP9988776655555` | Length > 12 characters | Highlight red border, error shown | **PASS** |
| **Email Address** | `email` | `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/` | `client@velora.com` | `client@com` | Missing valid top-level domain | Highlight red border, error shown | **PASS** |
| **Email Address** | `email` | `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/` | `patron.vip@atelier.paris.fr` | `client.velora.com` | Missing `@` symbol | Highlight red border, error shown | **PASS** |
| **Email Address** | `email` | `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/` | `e_vance+vip@domain.co` | `client@.com` | Domain name cannot start with `.` | Highlight red border, error shown | **PASS** |
| **Mobile Number** | `mobile` | `/^[6-9]\d{9}$/` | `9876543210` | `5123456789` | Does not begin with 6, 7, 8, or 9 | Highlight red border, error shown | **PASS** |
| **Mobile Number** | `mobile` | `/^[6-9]\d{9}$/` | `8123456789` | `987654321` | Only 9 digits (requires 10) | Highlight red border, error shown | **PASS** |
| **Mobile Number** | `mobile` | `/^[6-9]\d{9}$/` | `7999888777` | `98765432100` | 11 digits (exceeds 10) | Highlight red border, error shown | **PASS** |
| **Mobile Number** | `mobile` | `/^[6-9]\d{9}$/` | `6234567890` | `98765abcde` | Contains alphabetic characters | Highlight red border, error shown | **PASS** |
| **Boutique Division** | `dept` | `value.trim() !== ""` | `Paris Flagship` | `""` (Unselected) | User has not picked a salon | Highlight red border, error shown | **PASS** |
| **Security Password** | `password` | `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/` | `Password@123` | `password123` | Missing uppercase & special symbol | Highlight red border, error shown | **PASS** |
| **Security Password** | `password` | `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/` | `Couture$2026` | `Pass@1` | Length < 8 characters | Highlight red border, error shown | **PASS** |
| **Security Password** | `password` | `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/` | `Velora!999` | `VELORA!999` | Missing lowercase letter | Highlight red border, error shown | **PASS** |
| **Security Password** | `password` | `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/` | `Atelier$888` | `AtelierSecret$` | Missing numerical digit | Highlight red border, error shown | **PASS** |
| **Security Password** | `password` | `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/` | `Biella%Wool1` | `BiellaWool123` | Missing special symbol from `[@$!%*?&]` | Highlight red border, error shown | **PASS** |
| **Confirm Password** | `confirmPassword` | `confirmPassword === password && len > 0` | `Password@123` | `Password@999` | Does not match password field | Highlight red border, error shown | **PASS** |
| **Submit Button Gate** | `registerSubmitBtn` | `allFieldsValid === true` | All fields valid | Any single field invalid | Form incomplete | Submit button disabled (`disabled = true`) | **PASS** |

---

## 2. Cross-Device Viewport Audit Results

Testing was conducted across four standardized responsive breakpoints: **1440px** (Desktop), **1024px** (Laptop/Tablet Landscape), **768px** (Tablet Portrait/Breakpoint Threshold), and **375px** (Mobile).

### A. 1440px Viewport (Desktop Full Screen)
- **Navigation**: Desktop header visible with all 7 primary links (`Home`, `Collections`, `Atelier Story`, `Client Concierge`, `Patron Portal`, `Sign In`, `Register`), brand centered, theme toggle and action icons aligned right. Hamburger button hidden.
- **Home Dashboard (`home.html`)**: Renders strict 3-column CSS Grid layout (`display: grid; grid-template-columns: 250px 1fr 300px; gap: 2rem;`):
  - Left Column (250px): Patron profile card, session indicators, and sidebar navigation.
  - Centre Column (1fr): Welcome banner, 3 stat cards in a horizontal row, curated featured product grid.
  - Right Column (300px): Client calculator widget and concierge card.
- **Shop Catalogue (`shop.html`)**: Two-column layout with 280px left filter sidebar and 3-column fluid product grid.
- **Modals & Drawers**: Cart and wishlist slide-out drawers fixed right at 420px width. Checkout modal centered at 920px max-width.

### B. 1024px Viewport (Laptop & Tablet Landscape)
- **Navigation**: Fluid navbar spacing; no horizontal overflow.
- **Home Dashboard (`home.html`)**: Dashboard grid smoothly transitions to `grid-template-columns: 220px 1fr 280px; gap: 1.5rem;`.
- **Catalogue & Collections**: Product grid scales to 2–3 columns depending on card aspect ratio; filter controls remain accessible without horizontal scrollbars.

### C. 768px Viewport (Tablet Portrait & Threshold)
- **Navigation**: Desktop `.nav-links` switches to `display: none`. Hamburger button `#hamburgerBtn` activates. Clicking opens `#mobileNavDrawer` (z-index 200) sliding cleanly over the dark backdrop `#drawerOverlay` (z-index 150).
- **Home Dashboard (`home.html`)**: Switches to single-column vertical stack (`display: flex; flex-direction: column; gap: 1.5rem;`). Profile sidebar sits on top, main dashboard stats and featured items in the centre, and calculator widget anchors neatly below.
- **Shop Page**: Filter sidebar collapses above the main product grid; toolbar adjusts to full-width stacked search and sort selector.

### D. 375px Viewport (Mobile Phone)
- **Layout & Typography**: Fluid padding (`1rem`), text scaling with clamp functions (`clamp(1.8rem, 5vw, 2.8rem)`), and zero horizontal overflow (`overflow-x: hidden`).
- **Touch Targets**: All interactive elements, buttons (`.btn-block`), size pills, and calculator keypad buttons are at least 44×44px for touch accessibility.
- **Calculator Keypad**: 4-column CSS grid cleanly fills available screen width with high-contrast buttons and readable display.
- **Chatbot Floating Trigger**: Floating button docked at `bottom: 1.2rem; right: 1.2rem;` with badge. Chat window expands to 92vw width without clipping.

---

## 3. Functional Requirements Traceability Matrix (FR-01 to FR-08)

| Requirement ID | Course Specification | Primary File(s) | Key Implementation Details | Status |
|---|---|---|---|---|
| **FR-01** | Header with logo, section nav links, theme toggle, hero with CTA, feature overview cards, responsive layout | `index.html`, `css/styles.css`, `css/layout.css` | Header contains SVG brand logo, primary desktop nav, mobile drawer, theme toggle with Sun/Moon SVG icons. Hero with primary CTA buttons. Overview cards linking to category filters (`shop.html?category=outerwear`, etc.). | **VERIFIED** |
| **FR-02** | Registration form with exact regex rules, inline error spans, blur validation, disabled submit, real-time sync | `register.html`, `js/validation.js` | Inputs for `fullName`, `empId`, `email`, `mobile`, `dept`, `password`, `confirmPassword`. Red `.invalid` border and `<span class="error-msg">` on failure, `.valid` on success. Button disabled until all criteria pass. Confirm password resyncs on password input. | **VERIFIED** |
| **FR-03** | Simplified account creation with email, password, and ToS consent checkbox (submit disabled until valid & ticked) | `signup.html`, `js/validation.js` | Form `#signupForm` with `#signupEmail`, `#signupPassword`, `#tosCheck`. Submit button `#signupSubmitBtn` disabled until email format, password complexity, and checkbox are all satisfied. | **VERIFIED** |
| **FR-04** | Sign in with email, password, password reveal eye button, dynamic error alert banner, demo session handling | `signin.html`, `js/validation.js` | Password toggle button `.toggle-password-btn` switches `type="password"` / `type="text"` with SVG eye icon update. Banner `#signinStatusBanner` dynamically reports invalid format or mismatch. Authenticates against demo `velora_users` in `localStorage` and saves `velora_session`. | **VERIFIED** |
| **FR-05** | Home dashboard with 2 layouts: Desktop grid (`250px 1fr 300px`) and Mobile flex column; welcome, stats, products | `home.html`, `css/layout.css`, `js/products.js` | `.dashboard-grid-layout` with desktop 3 columns and mobile flex column. Live stat cards read cart items and wishlist counts from `localStorage`. Featured items dynamically rendered from `products.js`. Non-blocking guest mode prompt when unauthenticated. | **VERIFIED** |
| **FR-06** | Concierge Chatbot: floating button, bottom-right, `.user-msg`/`.bot-msg`, auto-scroll, word boundaries, demo tracker | `js/chatbot.js`, `css/styles.css` | Fixed position bottom-right, word-boundary regex (`\bdress\b`, `\baddress\b`), order numbers recognized and explicitly marked `[DEMO SIMULATION]`, promo code detection, `.user-msg` and `.bot-msg` nodes, auto-scroll with `scrollTop = scrollHeight`. | **VERIFIED** |
| **FR-07** | Theme engine: toggle button in header on EVERY page, `:root` light tokens, `[data-theme="dark"]` dark tokens, persistence | `js/theme.js`, `css/styles.css`, all `.html` | Theme toggle button `.theme-toggle-btn` present in header on all 8 pages. Light and dark CSS variables defined. `theme.js` executes immediately in `<head>` to prevent white flash, reads OS preference via `matchMedia`, and persists in `localStorage` under `velora_theme`. | **VERIFIED** |
| **FR-08** | Safe client calculator without `eval()` or `Function()`, division by zero handling, invalid expression error, keyboard input | `js/calculator.js`, `home.html` | Lexical tokenizer and two-pass operator-precedence parser (`*`/`/` before `+`/`-`). Division by zero shows `"Cannot divide by zero"`. Malformed inputs show `"Error"`. Recovers with `C`. Complete keyboard support (`0-9`, `+`, `-`, `*`, `/`, `.`, `Enter`, `Backspace`, `c`). | **VERIFIED** |

---

## 4. Bug Fixes & Code Quality Audit

1. **Mobile Navigation Overlay Z-Index**:
   - *Previous state*: Mobile nav drawer (`z-index: 105`) was occluded behind `#drawerOverlay` (`z-index: 150`).
   - *Resolution*: Elevated `#mobileNavDrawer` to `z-index: 200` in `css/layout.css`.
2. **Checkout Modal Reusability**:
   - *Previous state*: Submitting checkout wiped `#checkoutModalBody` via `innerHTML`, destroying the close button and summary containers on reopen.
   - *Resolution*: Split the modal into `#checkoutFormView` and `#checkoutSuccessView`. The success screen is toggled independently without mutating the dialog envelope or close button `#closeCheckoutModal`.
3. **Cart Color Hex Preservation**:
   - *Previous state*: Item added to cart always saved the first color swatch hex rather than the user's selected choice.
   - *Resolution*: `js/cart.js` now verifies the active swatch or matches the chosen color name to record the exact hexadecimal value.
4. **Security — InnerHTML Escaping**:
   - *Resolution*: Created and integrated an HTML entity sanitizer (`escapeHTML()`) applied across checkout receipt rendering, contact confirmations, chatbot responses, and review inputs.
5. **Accessibility & Focus-Visible**:
   - Added `:focus-visible` styles with champagne gold outlines (`2px solid var(--color-gold)`) to all buttons, inputs, links, and select elements.
   - Added `role="dialog"`, `aria-modal="true"`, and descriptive `aria-label` / `aria-labelledby` attributes to all modals (`#checkoutModal`, `#quickViewModal`, `#searchModal`).
6. **Shop Size Filter Expansion**:
   - Added coverage for all inventory sizes in `products.js`: `XS`, `S`, `M`, `L`, `XL`, `One Size`, `36`, `37`, `38`, `39`, `40`.
7. **Category & Anchor Link Cleanup**:
   - All collection cards and footer links now target `shop.html?category=...` and trigger automatic filtering via `URLSearchParams` on page load. All dead `#` links replaced.

---

## 5. Console & Network Verification

- **HTTP Status Verification**: All 19 static endpoints (8 HTML pages, 2 CSS stylesheets, 7 JavaScript files, and 2 SVG images) return HTTP status `200 OK`.
- **Browser Console Errors**: Verified `0` console errors and `0` unhandled promise rejections across all pages in both Light Mode and Dark Mode.
