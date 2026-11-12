/**
 * VELORA - Theme Engine (Vanilla JavaScript)
 * Supports Light & Dark themes with localStorage persistence and OS preference detection
 */

(function () {
  const THEME_STORAGE_KEY = "velora_theme";

  // Determine initial theme: stored preference -> OS preference -> 'light'
  function getPreferredTheme() {
    try {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme === "dark" || storedTheme === "light") {
        return storedTheme;
      }
    } catch (e) {
      console.warn("Could not read theme from localStorage", e);
    }

    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }

  // Apply theme immediately to document root
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    updateThemeToggleButtons(theme);
  }

  function updateThemeToggleButtons(theme) {
    const buttons = document.querySelectorAll(".theme-toggle-btn");
    buttons.forEach(btn => {
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme");
      btn.setAttribute("title", theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme");
    });
  }

  // Toggle theme between light and dark
  window.toggleVeloraTheme = function () {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (e) {
      console.warn("Could not save theme to localStorage", e);
    }
    applyTheme(newTheme);
  };

  // Run immediately before first paint
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  // Bind toggle buttons on DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    updateThemeToggleButtons(document.documentElement.getAttribute("data-theme") || "light");
    const toggleBtns = document.querySelectorAll(".theme-toggle-btn");
    toggleBtns.forEach(btn => {
      btn.addEventListener("click", window.toggleVeloraTheme);
    });

    // Listen for OS preference changes if no manual override
    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (!localStorage.getItem(THEME_STORAGE_KEY)) {
          applyTheme(e.matches ? "dark" : "light");
        }
      });
    }
  });
})();
