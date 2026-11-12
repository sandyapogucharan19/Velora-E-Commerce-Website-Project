/**
 * VELORA - Form Validation & Authentication Engine (Vanilla JavaScript)
 * Implements College Course 25CS208 IA-3 Requirements (FR-02, FR-03, FR-04)
 * 
 * DISCLAIMER: Client-side storage of user credentials in localStorage is
 * strictly for academic demonstration purposes (no backend server). In a
 * production environment, credentials must be transmitted securely over HTTPS
 * and authenticated using hashed tokens on a secure server.
 */

// Regex Validation Rules (FR-02)
const VALIDATION_RULES = {
  fullName: /^[a-zA-Z\s]{2,50}$/,
  empId: /^[A-Z0-9]{6,12}$/i,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  mobile: /^[6-9]\d{9}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
};

const ERROR_MESSAGES = {
  fullName: "Full name must be 2–50 characters (letters and spaces only).",
  empId: "Register/Client ID must be 6–12 alphanumeric characters.",
  email: "Please provide a valid email address (e.g. client@velora.com).",
  mobile: "Mobile number must be exactly 10 digits starting with 6, 7, 8, or 9.",
  dept: "Please select your primary boutique division or salon.",
  password: "Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special symbol (@$!%*?&).",
  confirmPassword: "Passwords do not match.",
  tosCheck: "You must accept the Terms of Service to proceed."
};

// Storage keys
const USERS_STORAGE_KEY = "velora_users";
const SESSION_STORAGE_KEY = "velora_session";

// Demo default account for instant testing
const DEFAULT_DEMO_USER = {
  fullName: "Eleanor Vance",
  empId: "VEL884291",
  email: "client@velora.com",
  mobile: "9876543210",
  dept: "Paris Flagship",
  password: "Password@123"
};

/**
 * Initialize Registered Users store
 */
function getStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      // Seed default user for test convenience
      const initial = [DEFAULT_DEMO_USER];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read users from localStorage", e);
    return [DEFAULT_DEMO_USER];
  }
}

function saveUser(user) {
  const users = getStoredUsers();
  users.push(user);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

/**
 * Active Session Management
 */
function getActiveSession() {
  try {
    const session = localStorage.getItem(SESSION_STORAGE_KEY);
    return session ? JSON.parse(session) : null;
  } catch (e) {
    return null;
  }
}

function setActiveSession(user) {
  const session = {
    email: user.email,
    fullName: user.fullName || user.email.split("@")[0],
    dept: user.dept || "Online Concierge",
    signedInAt: new Date().toISOString()
  };
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

// Global escape HTML helper
function escapeHTML(str) {
  if (!str) return "";
  return String(str).replace(/[&<>"']/g, match => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[match]));
}

/* ==========================================================================
   FR-02: Client Registration Form Controller (register.html)
   ========================================================================== */
function initRegisterForm() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  const fullName = document.getElementById("fullName");
  const empId = document.getElementById("empId");
  const email = document.getElementById("email");
  const mobile = document.getElementById("mobile");
  const dept = document.getElementById("dept");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const submitBtn = document.getElementById("registerSubmitBtn");
  const statusBanner = document.getElementById("registerStatusBanner");

  if (!submitBtn) return;
  submitBtn.disabled = true;

  const fields = [
    { el: fullName, key: "fullName", validator: val => VALIDATION_RULES.fullName.test(val.trim()) },
    { el: empId, key: "empId", validator: val => VALIDATION_RULES.empId.test(val.trim()) },
    { el: email, key: "email", validator: val => VALIDATION_RULES.email.test(val.trim()) },
    { el: mobile, key: "mobile", validator: val => VALIDATION_RULES.mobile.test(val.trim()) },
    { el: dept, key: "dept", validator: val => val.trim() !== "" },
    { el: password, key: "password", validator: val => VALIDATION_RULES.password.test(val) },
    { el: confirmPassword, key: "confirmPassword", validator: val => val === password.value && val.length > 0 }
  ];

  function validateField(fieldConfig, showInlineError = true) {
    const { el, key, validator } = fieldConfig;
    if (!el) return false;

    const isValid = validator(el.value);
    const parent = el.closest(".form-group") || el.parentElement;
    let errorSpan = parent.querySelector(".error-msg");

    if (!errorSpan) {
      errorSpan = document.createElement("span");
      errorSpan.className = "error-msg";
      parent.appendChild(errorSpan);
    }

    if (isValid) {
      el.classList.remove("invalid");
      el.classList.add("valid");
      errorSpan.textContent = "";
      errorSpan.style.display = "none";
    } else {
      el.classList.remove("valid");
      if (showInlineError && el.value.length > 0) {
        el.classList.add("invalid");
        errorSpan.textContent = ERROR_MESSAGES[key];
        errorSpan.style.display = "block";
      } else {
        el.classList.remove("invalid");
        errorSpan.textContent = "";
        errorSpan.style.display = "none";
      }
    }

    return isValid;
  }

  function checkFormValidity() {
    let allValid = true;
    fields.forEach(f => {
      if (!f.validator(f.el ? f.el.value : "")) {
        allValid = false;
      }
    });
    submitBtn.disabled = !allValid;
    return allValid;
  }

  // Attach real-time blur and input listeners
  fields.forEach(f => {
    if (!f.el) return;

    f.el.addEventListener("blur", () => {
      validateField(f, true);
      checkFormValidity();
    });

    f.el.addEventListener("input", () => {
      // Re-run validation on input if already invalid or when confirming password
      if (f.el.classList.contains("invalid") || f.key === "password" || f.key === "confirmPassword") {
        validateField(f, f.el.value.length > 0);
      }
      // Re-validate confirmPassword when password changes to keep them in sync
      if (f.key === "password" && confirmPassword.value.length > 0) {
        const confirmField = fields.find(item => item.key === "confirmPassword");
        validateField(confirmField, true);
      }
      checkFormValidity();
    });
  });

  if (dept) {
    dept.addEventListener("change", () => {
      const deptField = fields.find(item => item.key === "dept");
      validateField(deptField, true);
      checkFormValidity();
    });
  }

  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let formValid = true;
    fields.forEach(f => {
      if (!validateField(f, true)) {
        formValid = false;
      }
    });

    if (!formValid) {
      if (statusBanner) {
        statusBanner.className = "alert-banner error active";
        statusBanner.textContent = "Please correct the highlighted fields before submitting.";
      }
      return;
    }

    // Check if email already registered
    const users = getStoredUsers();
    if (users.some(u => u.email.toLowerCase() === email.value.trim().toLowerCase())) {
      email.classList.add("invalid");
      const parent = email.closest(".form-group");
      let errorSpan = parent.querySelector(".error-msg");
      if (errorSpan) {
        errorSpan.textContent = "This email is already enrolled in the VELORA Atelier.";
        errorSpan.style.display = "block";
      }
      if (statusBanner) {
        statusBanner.className = "alert-banner error active";
        statusBanner.textContent = "Account with this email already exists.";
      }
      submitBtn.disabled = true;
      return;
    }

    // Save user for demo authentication
    const newUser = {
      fullName: fullName.value.trim(),
      empId: empId.value.trim(),
      email: email.value.trim(),
      mobile: mobile.value.trim(),
      dept: dept.value,
      password: password.value // Demo-only: stored locally for verification
    };
    saveUser(newUser);

    submitBtn.innerHTML = "<span>Enrolling Patron...</span>";
    submitBtn.disabled = true;

    setTimeout(() => {
      if (statusBanner) {
        statusBanner.className = "alert-banner success active";
        statusBanner.innerHTML = `<strong>Registration Complete.</strong> Welcome to VELORA, ${escapeHTML(newUser.fullName)}. Redirecting to sign in...`;
      }
      if (window.showToast) {
        window.showToast("Atelier registration successful!", "success");
      }
      setTimeout(() => {
        window.location.href = "signin.html";
      }, 1500);
    }, 800);
  });
}

/* ==========================================================================
   FR-03: Simplified Sign Up Form Controller (signup.html)
   ========================================================================== */
function initSignUpForm() {
  const form = document.getElementById("signupForm");
  if (!form) return;

  const email = document.getElementById("signupEmail");
  const password = document.getElementById("signupPassword");
  const tosCheck = document.getElementById("tosCheck");
  const submitBtn = document.getElementById("signupSubmitBtn");
  const statusBanner = document.getElementById("signupStatusBanner");

  if (!submitBtn) return;
  submitBtn.disabled = true;

  function validateEmail() {
    const valid = VALIDATION_RULES.email.test(email.value.trim());
    const parent = email.closest(".form-group");
    let err = parent.querySelector(".error-msg");
    if (!err) {
      err = document.createElement("span");
      err.className = "error-msg";
      parent.appendChild(err);
    }
    if (valid) {
      email.classList.remove("invalid");
      email.classList.add("valid");
      err.textContent = "";
      err.style.display = "none";
    } else if (email.value.length > 0) {
      email.classList.add("invalid");
      email.classList.remove("valid");
      err.textContent = ERROR_MESSAGES.email;
      err.style.display = "block";
    }
    return valid;
  }

  function validatePassword() {
    const valid = VALIDATION_RULES.password.test(password.value);
    const parent = password.closest(".form-group");
    let err = parent.querySelector(".error-msg");
    if (!err) {
      err = document.createElement("span");
      err.className = "error-msg";
      parent.appendChild(err);
    }
    if (valid) {
      password.classList.remove("invalid");
      password.classList.add("valid");
      err.textContent = "";
      err.style.display = "none";
    } else if (password.value.length > 0) {
      password.classList.add("invalid");
      password.classList.remove("valid");
      err.textContent = ERROR_MESSAGES.password;
      err.style.display = "block";
    }
    return valid;
  }

  function checkForm() {
    const isEmailValid = VALIDATION_RULES.email.test(email.value.trim());
    const isPassValid = VALIDATION_RULES.password.test(password.value);
    const isTosChecked = tosCheck ? tosCheck.checked : true;
    const canSubmit = isEmailValid && isPassValid && isTosChecked;
    submitBtn.disabled = !canSubmit;
    return canSubmit;
  }

  email.addEventListener("blur", validateEmail);
  email.addEventListener("input", () => {
    if (email.classList.contains("invalid")) validateEmail();
    checkForm();
  });

  password.addEventListener("blur", validatePassword);
  password.addEventListener("input", () => {
    if (password.classList.contains("invalid")) validatePassword();
    checkForm();
  });

  if (tosCheck) {
    tosCheck.addEventListener("change", checkForm);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!checkForm()) return;

    const users = getStoredUsers();
    if (users.some(u => u.email.toLowerCase() === email.value.trim().toLowerCase())) {
      if (statusBanner) {
        statusBanner.className = "alert-banner error active";
        statusBanner.textContent = "An account with this email address already exists.";
      }
      return;
    }

    const newUser = {
      fullName: email.value.split("@")[0],
      empId: `VEL${Math.floor(100000 + Math.random() * 900000)}`,
      email: email.value.trim(),
      mobile: "9000000000",
      dept: "Online Concierge",
      password: password.value // Demo-only: local storage
    };
    saveUser(newUser);

    if (statusBanner) {
      statusBanner.className = "alert-banner success active";
      statusBanner.innerHTML = "Account created successfully. Redirecting to sign in...";
    }
    submitBtn.disabled = true;

    setTimeout(() => {
      window.location.href = "signin.html";
    }, 1200);
  });
}

/* ==========================================================================
   FR-04: Sign In Form Controller & Password Toggle (signin.html)
   ========================================================================== */
function initSignInForm() {
  const form = document.getElementById("signinForm");
  if (!form) return;

  const email = document.getElementById("signinEmail");
  const password = document.getElementById("signinPassword");
  const submitBtn = document.getElementById("signinSubmitBtn");
  const statusBanner = document.getElementById("signinStatusBanner");

  // Eye toggle functionality
  const eyeButtons = document.querySelectorAll(".toggle-password-btn");
  eyeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetInput = btn.previousElementSibling || document.getElementById(btn.getAttribute("data-target"));
      if (!targetInput) return;

      const isPassword = targetInput.type === "password";
      targetInput.type = isPassword ? "text" : "password";
      btn.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
      btn.innerHTML = isPassword
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailVal = email.value.trim();
    const passVal = password.value;

    // Reset status
    if (statusBanner) {
      statusBanner.className = "alert-banner";
      statusBanner.textContent = "";
    }

    // Format validation check
    if (!VALIDATION_RULES.email.test(emailVal) || passVal.length === 0) {
      if (statusBanner) {
        statusBanner.className = "alert-banner error active";
        statusBanner.textContent = "Please provide a valid email format and password.";
      }
      return;
    }

    // Demo Authentication against localStorage
    const users = getStoredUsers();
    const matchedUser = users.find(u => u.email.toLowerCase() === emailVal.toLowerCase());

    if (!matchedUser || matchedUser.password !== passVal) {
      if (statusBanner) {
        statusBanner.className = "alert-banner error active";
        statusBanner.innerHTML = `<strong>Authentication Failed:</strong> Invalid email or password credentials. <br><small>Demo access: client@velora.com / Password@123</small>`;
      }
      if (window.showToast) {
        window.showToast("Invalid credentials. Please re-enter.", "error");
      }
      return;
    }

    // Success: save active session and proceed to home.html
    setActiveSession(matchedUser);

    if (statusBanner) {
      statusBanner.className = "alert-banner success active";
      statusBanner.textContent = `Access granted. Welcome back, ${matchedUser.fullName || matchedUser.email}.`;
    }

    if (window.showToast) {
      window.showToast("Signed in successfully. Opening dashboard...", "success");
    }

    setTimeout(() => {
      window.location.href = "home.html";
    }, 900);
  });
}

// Bind controllers on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  initRegisterForm();
  initSignUpForm();
  initSignInForm();
});

// Expose utilities globally
window.VeloraAuth = {
  getStoredUsers,
  getActiveSession,
  setActiveSession,
  clearSession,
  escapeHTML
};
