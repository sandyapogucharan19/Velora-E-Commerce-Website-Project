/**
 * VELORA - Safe Client Calculator (Vanilla JavaScript)
 * Implements FR-08 (Safe Arithmetic Parser without eval() or Function())
 * 
 * Supports:
 * - Digits 0-9, Decimal (.)
 * - Operators: +, -, *, /
 * - Clear (C), Equals (=)
 * - Error States: "Cannot divide by zero", "Error"
 * - Keyboard input support
 */

(function () {
  let currentExpression = "0";
  let hasError = false;

  /**
   * Safe Arithmetic Parser
   * Evaluates expressions honoring standard mathematical operator precedence (* and / before + and -)
   * Completely avoids eval() and new Function()
   */
  function safeEvaluate(expr) {
    if (!expr || typeof expr !== "string") {
      return { success: false, error: "Error" };
    }

    // Clean whitespace
    const cleanExpr = expr.trim();
    if (!cleanExpr) return { success: true, value: 0 };

    // Tokenizer
    const tokens = [];
    let i = 0;
    const len = cleanExpr.length;

    while (i < len) {
      const char = cleanExpr[i];

      // Skip whitespace
      if (/\s/.test(char)) {
        i++;
        continue;
      }

      // Check for operators
      if (char === "+" || char === "*" || char === "/") {
        tokens.push(char);
        i++;
        continue;
      }

      // Minus could be binary operator or unary negative number
      if (char === "-") {
        const prevToken = tokens[tokens.length - 1];
        const isUnary = tokens.length === 0 || (typeof prevToken === "string" && ["+", "-", "*", "/"].includes(prevToken));

        if (isUnary) {
          // Read negative number
          i++;
          let numStr = "-";
          while (i < len && /[0-9.]/.test(cleanExpr[i])) {
            numStr += cleanExpr[i];
            i++;
          }
          if (numStr === "-" || isNaN(Number(numStr))) {
            return { success: false, error: "Error" };
          }
          tokens.push(parseFloat(numStr));
          continue;
        } else {
          tokens.push("-");
          i++;
          continue;
        }
      }

      // Number / decimal
      if (/[0-9.]/.test(char)) {
        let numStr = "";
        let decimalCount = 0;
        while (i < len && /[0-9.]/.test(cleanExpr[i])) {
          if (cleanExpr[i] === ".") {
            decimalCount++;
            if (decimalCount > 1) {
              return { success: false, error: "Error" };
            }
          }
          numStr += cleanExpr[i];
          i++;
        }
        if (isNaN(Number(numStr))) {
          return { success: false, error: "Error" };
        }
        tokens.push(parseFloat(numStr));
        continue;
      }

      // Unrecognized character
      return { success: false, error: "Error" };
    }

    if (tokens.length === 0) {
      return { success: true, value: 0 };
    }

    // Expression must not end with an operator
    const lastToken = tokens[tokens.length - 1];
    if (typeof lastToken === "string" && ["+", "-", "*", "/"].includes(lastToken)) {
      return { success: false, error: "Error" };
    }

    // First Pass: Process Multiplication and Division (*, /)
    const pass1 = [];
    let idx = 0;
    while (idx < tokens.length) {
      const token = tokens[idx];

      if (token === "*" || token === "/") {
        const prev = pass1.pop();
        const next = tokens[idx + 1];

        if (typeof prev !== "number" || typeof next !== "number") {
          return { success: false, error: "Error" };
        }

        if (token === "/") {
          if (next === 0) {
            return { success: false, error: "Cannot divide by zero" };
          }
          pass1.push(prev / next);
        } else {
          pass1.push(prev * next);
        }
        idx += 2; // consumed operator and next operand
      } else {
        pass1.push(token);
        idx++;
      }
    }

    // Second Pass: Process Addition and Subtraction (+, -)
    if (pass1.length === 0) return { success: true, value: 0 };
    if (typeof pass1[0] !== "number") return { success: false, error: "Error" };

    let result = pass1[0];
    let k = 1;

    while (k < pass1.length) {
      const op = pass1[k];
      const nextNum = pass1[k + 1];

      if (typeof nextNum !== "number") {
        return { success: false, error: "Error" };
      }

      if (op === "+") {
        result += nextNum;
      } else if (op === "-") {
        result -= nextNum;
      } else {
        return { success: false, error: "Error" };
      }
      k += 2;
    }

    // Precision cleanup for IEEE 754 floating point (e.g. 0.1 + 0.2)
    const rounded = Math.round(result * 1e8) / 1e8;
    return { success: true, value: rounded };
  }

  function updateDisplay(text) {
    const displayEl = document.getElementById("calcDisplay");
    if (displayEl) {
      displayEl.textContent = text;
      // Scroll to end if long
      displayEl.scrollLeft = displayEl.scrollWidth;
    }
  }

  function handleInput(char) {
    if (hasError) {
      if (char === "C" || char === "c" || char === "Escape") {
        resetCalculator();
      }
      return;
    }

    if (char === "C" || char === "c" || char === "Escape") {
      resetCalculator();
      return;
    }

    if (char === "=" || char === "Enter") {
      executeCalculation();
      return;
    }

    if (char === "Backspace") {
      if (currentExpression.length > 1) {
        currentExpression = currentExpression.slice(0, -1);
      } else {
        currentExpression = "0";
      }
      updateDisplay(currentExpression);
      return;
    }

    // Operators
    const isOperator = ["+", "-", "*", "/"].includes(char);

    if (currentExpression === "0" && !isOperator && char !== ".") {
      currentExpression = char;
    } else {
      // Prevent consecutive operators except minus for negative
      const lastChar = currentExpression.slice(-1);
      const lastIsOp = ["+", "-", "*", "/"].includes(lastChar);

      if (isOperator && lastIsOp) {
        if (char === "-" && lastChar !== "-") {
          currentExpression += char;
        } else {
          currentExpression = currentExpression.slice(0, -1) + char;
        }
      } else {
        currentExpression += char;
      }
    }

    updateDisplay(currentExpression);
  }

  function executeCalculation() {
    const outcome = safeEvaluate(currentExpression);
    if (outcome.success) {
      currentExpression = String(outcome.value);
      hasError = false;
      updateDisplay(currentExpression);
    } else {
      hasError = true;
      updateDisplay(outcome.error);
    }
  }

  function resetCalculator() {
    currentExpression = "0";
    hasError = false;
    updateDisplay("0");
  }

  function initCalculator() {
    const widget = document.getElementById("calculatorWidget");
    if (!widget) return;

    // Click handlers on calculator buttons
    const buttons = widget.querySelectorAll(".calc-btn");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const val = btn.getAttribute("data-val");
        if (val) {
          handleInput(val);
        }
      });
    });

    // Keyboard support
    document.addEventListener("keydown", (e) => {
      // Don't intercept if user is typing in form inputs/textarea
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
      if (activeTag === "input" || activeTag === "textarea" || activeTag === "select") {
        return;
      }

      const key = e.key;
      if (/[0-9]/.test(key) || ["+", "-", "*", "/", ".", "=", "Enter", "Backspace", "Escape", "c", "C"].includes(key)) {
        e.preventDefault();
        handleInput(key);
      }
    });

    updateDisplay(currentExpression);
  }

  // Mount on DOM ready
  document.addEventListener("DOMContentLoaded", initCalculator);

  // Expose parser for programmatic verification
  window.VeloraCalculator = {
    evaluate: safeEvaluate,
    input: handleInput,
    reset: resetCalculator
  };
})();
