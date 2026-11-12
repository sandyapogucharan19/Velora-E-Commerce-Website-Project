/**
 * VELORA - Luxury Concierge Chatbot (Vanilla JavaScript)
 * Interactive, client styling concierge & automated assistance
 */

(function () {
  const CHAT_STORAGE_KEY = "velora_concierge_chat_history";

  const INITIAL_MESSAGE = {
    sender: "bot",
    time: getCurrentTime(),
    text: "Welcome to <strong>VELORA Atelier</strong>. I am your personal digital concierge. How may I assist your wardrobe selection or inquiries today?",
    chips: ["Sizing Consultation", "Bestsellers", "Track Order", "Complimentary Shipping", "Return Policy"]
  };

  // State
  let chatHistory = [];
  let isChatOpen = false;

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function loadChatHistory() {
    try {
      const stored = sessionStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) {
        chatHistory = JSON.parse(stored);
      } else {
        chatHistory = [INITIAL_MESSAGE];
      }
    } catch (e) {
      chatHistory = [INITIAL_MESSAGE];
    }
  }

  function saveChatHistory() {
    try {
      sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatHistory));
    } catch (e) {
      console.warn("Could not save chat history to sessionStorage", e);
    }
  }

  // Initialize Chatbot UI
  function initChatbot() {
    loadChatHistory();
    injectChatbotDOM();
    bindEvents();
    renderChatMessages();
  }

  function injectChatbotDOM() {
    if (document.getElementById("veloraChatbotWrapper")) return;

    const wrapper = document.createElement("div");
    wrapper.id = "veloraChatbotWrapper";
    wrapper.className = "velora-chatbot-wrapper";

    wrapper.innerHTML = `
      <!-- Floating Trigger Button -->
      <button id="chatbotTrigger" class="chatbot-trigger-btn" aria-label="Open Velora Concierge">
        <span class="chatbot-trigger-badge">Concierge</span>
        <svg class="icon-open" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <svg class="icon-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <!-- Chat Window -->
      <div id="chatbotWindow" class="chatbot-window">
        <!-- Header -->
        <div class="chatbot-header">
          <div class="chatbot-header-avatar">
            <span>V</span>
          </div>
          <div class="chatbot-header-info">
            <h4>VELORA Concierge</h4>
            <div class="chatbot-header-status">
              <span class="status-dot"></span>
              <span>Online • Private Styling</span>
            </div>
          </div>
          <button id="chatbotMinimizeBtn" class="chatbot-close-btn" aria-label="Minimize Chat">&minus;</button>
        </div>

        <!-- Messages Body -->
        <div id="chatbotMessages" class="chatbot-body"></div>

        <!-- Quick Reply Chips Container -->
        <div id="chatbotChips" class="chatbot-chips-bar"></div>

        <!-- Footer / Input Form -->
        <form id="chatbotForm" class="chatbot-footer">
          <input 
            type="text" 
            id="chatbotInput" 
            placeholder="Ask about fabrics, sizing, or orders..." 
            autocomplete="off"
            required 
          />
          <button type="submit" id="chatbotSendBtn" aria-label="Send message">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(wrapper);
  }

  function bindEvents() {
    const trigger = document.getElementById("chatbotTrigger");
    const minimizeBtn = document.getElementById("chatbotMinimizeBtn");
    const form = document.getElementById("chatbotForm");
    const input = document.getElementById("chatbotInput");

    if (trigger) {
      trigger.addEventListener("click", toggleChat);
    }

    if (minimizeBtn) {
      minimizeBtn.addEventListener("click", closeChat);
    }

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        sendMessage(text);
        input.value = "";
      });
    }
  }

  function toggleChat() {
    isChatOpen = !isChatOpen;
    const windowEl = document.getElementById("chatbotWindow");
    const triggerEl = document.getElementById("chatbotTrigger");
    if (windowEl && triggerEl) {
      if (isChatOpen) {
        windowEl.classList.add("active");
        triggerEl.classList.add("active");
        scrollToBottom();
        document.getElementById("chatbotInput")?.focus();
      } else {
        windowEl.classList.remove("active");
        triggerEl.classList.remove("active");
      }
    }
  }

  function closeChat() {
    isChatOpen = false;
    document.getElementById("chatbotWindow")?.classList.remove("active");
    document.getElementById("chatbotTrigger")?.classList.remove("active");
  }

  function scrollToBottom() {
    const body = document.getElementById("chatbotMessages");
    if (body) {
      setTimeout(() => {
        body.scrollTop = body.scrollHeight;
      }, 50);
    }
  }

  function renderChatMessages() {
    const body = document.getElementById("chatbotMessages");
    const chipsContainer = document.getElementById("chatbotChips");
    if (!body) return;

    body.innerHTML = chatHistory.map(msg => {
      const isBot = msg.sender === "bot";
      return `
        <div class="chat-message ${isBot ? 'bot-message' : 'user-message'}">
          ${isBot ? '<div class="msg-avatar">V</div>' : ''}
          <div class="msg-content">
            <div class="msg-bubble">${msg.text}</div>
            ${msg.products ? renderChatProductCards(msg.products) : ''}
            <span class="msg-time">${msg.time}</span>
          </div>
        </div>
      `;
    }).join("");

    // Render chips of the last bot message
    const lastMsg = chatHistory[chatHistory.length - 1];
    if (chipsContainer) {
      if (lastMsg && lastMsg.sender === "bot" && lastMsg.chips && lastMsg.chips.length > 0) {
        chipsContainer.innerHTML = lastMsg.chips.map(chip => `
          <button type="button" class="chat-chip" onclick="window.VeloraChatbot.handleChipClick('${chip}')">${chip}</button>
        `).join("");
        chipsContainer.style.display = "flex";
      } else {
        chipsContainer.innerHTML = "";
        chipsContainer.style.display = "none";
      }
    }

    scrollToBottom();
  }

  function renderChatProductCards(products) {
    return `
      <div class="chat-product-carousel">
        ${products.map(p => `
          <div class="chat-product-card">
            <img src="${p.image}" alt="${p.name}" />
            <div class="card-info">
              <h6>${p.name}</h6>
              <span class="price">$${p.price}</span>
              <button type="button" class="btn-chat-view" onclick="window.openQuickView('${p.id}')">View Details</button>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function showTypingIndicator() {
    const body = document.getElementById("chatbotMessages");
    if (!body) return;

    const typingDiv = document.createElement("div");
    typingDiv.id = "chatbotTyping";
    typingDiv.className = "chat-message bot-message typing-indicator-msg";
    typingDiv.innerHTML = `
      <div class="msg-avatar">V</div>
      <div class="msg-bubble typing-bubble">
        <span></span><span></span><span></span>
      </div>
    `;
    body.appendChild(typingDiv);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const el = document.getElementById("chatbotTyping");
    if (el) el.remove();
  }

  function sendMessage(text) {
    // Push user message
    chatHistory.push({
      sender: "user",
      time: getCurrentTime(),
      text: escapeHTML(text)
    });
    saveChatHistory();
    renderChatMessages();

    // Show bot typing
    showTypingIndicator();

    // Process Bot Response
    setTimeout(() => {
      removeTypingIndicator();
      const botResponse = generateBotResponse(text);
      chatHistory.push({
        sender: "bot",
        time: getCurrentTime(),
        text: botResponse.text,
        chips: botResponse.chips || ["Bestsellers", "Sizing Consultation", "Return Policy", "Contact Stylist"],
        products: botResponse.products || null
      });
      saveChatHistory();
      renderChatMessages();
    }, 700);
  }

  function escapeHTML(str) {
    const p = document.createElement("p");
    p.textContent = str;
    return p.innerHTML;
  }

  /**
   * Natural Language & Rule-based Response Engine
   */
  function generateBotResponse(input) {
    const text = input.toLowerCase().trim();

    // 1. Order tracking
    const orderMatch = text.match(/vel-\d{5,6}/i) || text.match(/\b\d{5,6}\b/);
    if (orderMatch || text.includes("track") || text.includes("where is my order")) {
      const orderRef = orderMatch ? orderMatch[0].toUpperCase() : "VEL-749102";
      return {
        text: `Your order <strong>${orderRef}</strong> is currently <em>In Transit via Insured Express Courier</em>. Expected delivery to your residence is within 2 business days. White-glove signature is required upon handover.`,
        chips: ["Delivery Updates", "Change Address", "Contact Concierge"]
      };
    }

    // 2. Sizing and Fit Consultation
    if (text.includes("size") || text.includes("sizing") || text.includes("fit") || text.includes("measurement")) {
      return {
        text: `VELORA garments follow European tailoring standards (FR / IT sizing). Our outerwear and blazers are tailored with structured drape. For a relaxed contemporary silhouette, we suggest your true size. If you desire tailored contouring, our atelier master recommends sizing down.<br><br>Would you like our comprehensive measurement metrics?`,
        chips: ["Outerwear Size", "Dress Sizing", "Book Personal Stylist"]
      };
    }

    // 3. Shipping & Delivery
    if (text.includes("shipping") || text.includes("delivery") || text.includes("courier") || text.includes("dispatch")) {
      return {
        text: `We offer <strong>Complimentary Insured Worldwide Delivery</strong> on all acquisitions exceeding $250. Orders placed prior to 14:00 CET are dispatched same-day from our Milan atelier in our signature black embossed gift packaging.`,
        chips: ["Track Order", "Return Policy", "Explore Collections"]
      };
    }

    // 4. Returns & Exchanges
    if (text.includes("return") || text.includes("exchange") || text.includes("refund")) {
      return {
        text: `We welcome returns and size exchanges within <strong>30 days of receipt</strong>. All items must remain unworn, unaltered, with original security tags and garment bags intact. Complimentary courier collection can be arranged directly from your home.`,
        chips: ["Initiate Return", "Client Care", "Bestsellers"]
      };
    }

    // 5. Product Recommendations - Dresses
    if (text.includes("dress") || text.includes("evening") || text.includes("gown") || text.includes("wedding") || text.includes("party")) {
      const dresses = VeloraProducts.getAll().filter(p => p.category === "dresses");
      return {
        text: `Our evening repertoire centers on fluid 22-momme Mulberry silk and bias-cut architecture. Here is our spotlight creation:`,
        products: dresses.length > 0 ? dresses : [VeloraProducts.getAll()[1]],
        chips: ["Silk Charmeuse", "Sizing Consultation", "All Collections"]
      };
    }

    // 6. Product Recommendations - Outerwear / Coats
    if (text.includes("coat") || text.includes("outerwear") || text.includes("jacket") || text.includes("blazer") || text.includes("winter")) {
      const outerwear = VeloraProducts.getAll().filter(p => p.category === "outerwear" || p.category === "tailoring").slice(0, 2);
      return {
        text: `Discover our artisanal outerwear—woven from virgin wool and Mongolian cashmere, crafted in Biella:`,
        products: outerwear,
        chips: ["Cashmere Coat", "Tailored Blazer", "Explore Shop"]
      };
    }

    // 7. Product Recommendations - Accessories / Bags / Jewelry
    if (text.includes("bag") || text.includes("tote") || text.includes("accessory") || text.includes("earring") || text.includes("jewelry") || text.includes("scarf")) {
      const accessories = VeloraProducts.getAll().filter(p => p.category === "accessories").slice(0, 2);
      return {
        text: `Our accessories are sculpted from vegetable-tanned Tuscan leather and 18K gold vermeil:`,
        products: accessories,
        chips: ["Atelier Tote", "Gold Earrings", "Silk Scarf"]
      };
    }

    // 8. Bestsellers & Featured
    if (text.includes("bestseller") || text.includes("popular") || text.includes("recommend") || text.includes("collection") || text.includes("trending")) {
      const featured = VeloraProducts.getFeatured().slice(0, 3);
      return {
        text: `Here are our most celebrated pieces favored by our international clientele:`,
        products: featured,
        chips: ["Cashmere Coat", "Evening Gown", "View All in Shop"]
      };
    }

    // 9. Fabric & Sustainable Atelier Craft
    if (text.includes("fabric") || text.includes("silk") || text.includes("cashmere") || text.includes("sustainable") || text.includes("material")) {
      return {
        text: `Every VELORA piece is crafted under ethical slow-fashion principles using GOTS-certified cashmere, Grade 6A silk, and deadstock fine wool sourced from historic heritage mills in Italy and France.`,
        chips: ["Read Our Story", "Browse Knitwear", "Contact Atelier"]
      };
    }

    // 10. Human Stylist / Contact
    if (text.includes("human") || text.includes("call") || text.includes("contact") || text.includes("stylist") || text.includes("appointment")) {
      return {
        text: `Our bespoke stylist team is available for private salon consultations at our Paris, Milan, and New York boutiques or virtually via video call. You may reach our private desk at <strong>concierge@velora-couture.com</strong> or visit our <a href="contact.html" style="color:#C5A880; text-decoration:underline;">Contact Concierge</a>.`,
        chips: ["Flagship Boutiques", "Send Message", "Sizing Guide"]
      };
    }

    // 11. Promo code inquiry
    if (text.includes("promo") || text.includes("code") || text.includes("coupon") || text.includes("discount")) {
      return {
        text: `Welcome to the VELORA circle. Use privilege code <strong>VELORA15</strong> at checkout for 15% off your first acquisition, or <strong>FREESHIP</strong> for worldwide express delivery.`,
        chips: ["Apply Code in Bag", "Bestsellers", "Shop Now"]
      };
    }

    // Default Fallback
    return {
      text: `Thank you for sharing your thoughts. As your dedicated VELORA stylist, I can help you find curated garments, check sizing measurements, verify order logistics, or book a private boutique fitting. How may I refine your selection?`,
      chips: ["Bestsellers", "Sizing Consultation", "Outerwear", "Complimentary Shipping", "Contact Stylist"]
    };
  }

  // Expose global controller
  window.VeloraChatbot = {
    open: function () {
      if (!isChatOpen) toggleChat();
    },
    close: closeChat,
    handleChipClick: function (chipText) {
      if (chipText === "Bestsellers") {
        sendMessage("Show me your bestsellers");
      } else if (chipText === "Sizing Consultation") {
        sendMessage("How do your sizes fit?");
      } else if (chipText === "Track Order") {
        sendMessage("Where is my order?");
      } else if (chipText === "Complimentary Shipping") {
        sendMessage("What are your shipping policies?");
      } else if (chipText === "Return Policy") {
        sendMessage("How do returns work?");
      } else if (chipText === "Apply Code in Bag") {
        VeloraCart.applyCoupon("VELORA15");
        VeloraCart.openCartDrawer();
      } else if (chipText === "View All in Shop" || chipText === "Explore Shop") {
        window.location.href = "shop.html";
      } else {
        sendMessage(chipText);
      }
    }
  };

  // Mount on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChatbot);
  } else {
    initChatbot();
  }
})();
