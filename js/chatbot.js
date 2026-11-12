/**
 * VELORA - Luxury Concierge Chatbot (Vanilla JavaScript)
 * Interactive, client styling concierge & automated assistance
 * Implements FR-06 with robust word-boundary matching, .user-msg/.bot-msg nodes,
 * explicit quick-reply handlers, and demo order tracking.
 */

(function () {
  const CHAT_STORAGE_KEY = "velora_concierge_chat_history";

  const INITIAL_MESSAGE = {
    sender: "bot",
    time: getCurrentTime(),
    text: "Welcome to <strong>VELORA Atelier</strong>. I am your personal digital styling concierge. How may I assist your wardrobe selection or inquiries today?",
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
      <button id="chatbotTrigger" class="chatbot-trigger-btn" aria-label="Open Velora Concierge Chat" title="Open Velora Concierge">
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
      <div id="chatbotWindow" class="chatbot-window" role="dialog" aria-modal="true" aria-label="Velora Styling Concierge">
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
          <button id="chatbotMinimizeBtn" class="chatbot-close-btn" aria-label="Minimize Chat" title="Minimize Chat">&minus;</button>
        </div>

        <!-- Messages Body (chatLog) -->
        <div id="chatbotMessages" class="chatbot-body" role="log" aria-live="polite"></div>

        <!-- Quick Reply Chips Container -->
        <div id="chatbotChips" class="chatbot-chips-bar" aria-label="Suggested Inquiries"></div>

        <!-- Footer / Input Form -->
        <form id="chatbotForm" class="chatbot-footer">
          <input 
            type="text" 
            id="chatbotInput" 
            placeholder="Ask about fabrics, sizing, or orders..." 
            autocomplete="off"
            aria-label="Chat input message"
            required 
          />
          <button type="submit" id="chatbotSendBtn" aria-label="Send message" title="Send message">
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

  // Auto-scroll FR-06 requirement: chatLog.scrollTop = chatLog.scrollHeight
  function scrollToBottom() {
    const chatLog = document.getElementById("chatbotMessages");
    if (chatLog) {
      setTimeout(() => {
        chatLog.scrollTop = chatLog.scrollHeight;
      }, 40);
    }
  }

  function renderChatMessages() {
    const chatLog = document.getElementById("chatbotMessages");
    const chipsContainer = document.getElementById("chatbotChips");
    if (!chatLog) return;

    chatLog.innerHTML = chatHistory.map(msg => {
      const isBot = msg.sender === "bot";
      // Node classes: .bot-msg / .user-msg per FR-06
      return `
        <div class="chat-message ${isBot ? 'bot-msg bot-message' : 'user-msg user-message'}">
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
          <button type="button" class="chat-chip" onclick="window.VeloraChatbot.handleChipClick('${escapeHTML(chip)}')">${escapeHTML(chip)}</button>
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
            <img src="${p.image}" alt="${escapeHTML(p.name)}" />
            <div class="card-info">
              <h6>${escapeHTML(p.name)}</h6>
              <span class="price">$${p.price}</span>
              <button type="button" class="btn-chat-view" onclick="window.openQuickView('${p.id}')">View Details</button>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function showTypingIndicator() {
    const chatLog = document.getElementById("chatbotMessages");
    if (!chatLog) return;

    const typingDiv = document.createElement("div");
    typingDiv.id = "chatbotTyping";
    typingDiv.className = "chat-message bot-msg bot-message typing-indicator-msg";
    typingDiv.innerHTML = `
      <div class="msg-avatar">V</div>
      <div class="msg-bubble typing-bubble">
        <span></span><span></span><span></span>
      </div>
    `;
    chatLog.appendChild(typingDiv);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const el = document.getElementById("chatbotTyping");
    if (el) el.remove();
  }

  function sendMessage(text) {
    chatHistory.push({
      sender: "user",
      time: getCurrentTime(),
      text: escapeHTML(text)
    });
    saveChatHistory();
    renderChatMessages();

    showTypingIndicator();

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
    }, 600);
  }

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

  /**
   * FR-06 Priority Rule Engine with Word-Boundary Regex
   * Priority:
   * 1. Address / Destination changes (prevent matching "dress")
   * 2. Order tracking (only explicit order formats or queries, labeled as demo)
   * 3. Promotional codes (word boundary to avoid "decode")
   * 4. Sizing and Fit Consultation
   * 5. Dresses / Eveningwear
   * 6. Outerwear & Tailoring
   * 7. Leather & Accessories
   * 8. Knitwear & Cashmere
   * 9. Shipping & Dispatch Policy
   * 10. Returns & Exchanges
   * 11. Sustainable Craft & Atelier
   * 12. Human Concierge & Flagship Salons
   * 13. Bestsellers & Featured
   */
  function generateBotResponse(input) {
    const text = input.trim();

    // 1. Address Change (Must check before dresses so "change address" doesn't trigger dress!)
    if (/\b(change\s+address|update\s+address|delivery\s+address|shipping\s+address|new\s+address)\b/i.test(text)) {
      return {
        text: `To update the destination address for an in-flight dispatch, please notify our client desk immediately at <strong>concierge@velora-couture.com</strong> or call <strong>+33 (0)1 42 68 55 00</strong> with your order reference.`,
        chips: ["Track Order", "Client Care", "Return Policy"]
      };
    }

    // 2. Order Tracking (Strict: must have VEL-XXXXXX or explicit track command; DO NOT match arbitrary numbers)
    const specificOrderMatch = text.match(/\bvel-\d{5,6}\b/i) || text.match(/\border\s*#?\s*\d{5,6}\b/i);
    const trackIntent = /\b(track|tracking|order status|where is my order|check order|order update|delivery status)\b/i.test(text);

    if (specificOrderMatch || trackIntent) {
      const orderRef = specificOrderMatch ? specificOrderMatch[0].toUpperCase() : "VEL-749102";
      return {
        text: `<em>[DEMO SIMULATION]</em> Order Reference <strong>${orderRef}</strong>:<br>
• Status: <strong>In Transit via Insured Express Courier</strong><br>
• Departure: Milan Atelier (Dispatched)<br>
• Estimated Delivery: Within 2 Business Days<br>
• Signature: White-Glove Handover Required.`,
        chips: ["Delivery Updates", "Change Address", "Contact Concierge"]
      };
    }

    // 3. Promotional Codes & Discounts (Word boundary so "decode" or "coder" does not match)
    if (/\b(promo|code|codes|coupon|coupons|discount|discounts|voucher|privilege code)\b/i.test(text)) {
      return {
        text: `Welcome to the VELORA circle. Use privilege code <strong>VELORA15</strong> at checkout for 15% off your acquisition, <strong>VIP20</strong> for 20% off seasonal tailoring, or <strong>FREESHIP</strong> for complimentary worldwide courier.`,
        chips: ["Apply Code in Bag", "Bestsellers", "Explore Collections"]
      };
    }

    // 4. Sizing and Fit Consultation
    if (/\b(size|sizes|sizing|measurement|measurements|fit|fitting|proportions)\b/i.test(text)) {
      return {
        text: `VELORA garments follow European tailoring standards (FR / IT sizing). Our outerwear and blazers are tailored with structured drape. For a relaxed contemporary silhouette, choose your true size; for a tapered contour, our atelier master recommends one size down.<br><br>Detailed proportions are available on each creation's Quick View modal.`,
        chips: ["Outerwear Size", "Dress Sizing", "Contact Stylist"]
      };
    }

    // 5. Dresses / Eveningwear (Bias cut, Mulberry silk)
    if (/\b(dress|dresses|gown|gowns|eveningwear|slip|charmeuse)\b/i.test(text)) {
      const dresses = VeloraProducts.getAll().filter(p => p.category === "dresses");
      return {
        text: `Our evening repertoire is bias-cut from heavy 22-momme Mulberry silk for fluid liquid drape. Here is our spotlight creation:`,
        products: dresses.length > 0 ? dresses : [VeloraProducts.getAll()[1]],
        chips: ["Silk Charmeuse", "Sizing Consultation", "All Collections"]
      };
    }

    // 6. Outerwear & Tailoring
    if (/\b(coat|coats|outerwear|jacket|jackets|blazer|blazers|trench|tuxedo|tailoring)\b/i.test(text)) {
      const outerwear = VeloraProducts.getAll().filter(p => p.category === "outerwear" || p.category === "tailoring").slice(0, 2);
      return {
        text: `Discover our artisanal outerwear—sculpted from virgin wool and Mongolian cashmere, crafted in Biella and Lyon:`,
        products: outerwear,
        chips: ["Cashmere Coat", "Tailored Blazer", "Explore Shop"]
      };
    }

    // 7. Leather Goods & Fine Jewelry
    if (/\b(bag|bags|tote|totes|accessory|accessories|earring|earrings|jewelry|scarf|scarves|leather)\b/i.test(text)) {
      const accessories = VeloraProducts.getAll().filter(p => p.category === "accessories").slice(0, 2);
      return {
        text: `Our accessories are crafted from vegetable-tanned Tuscan calfskin, pure silk twill, and Aegean molten 18K gold vermeil:`,
        products: accessories,
        chips: ["Atelier Tote", "Gold Earrings", "Silk Scarf"]
      };
    }

    // 8. Knitwear & Cashmere
    if (/\b(cashmere|knit|knitwear|sweater|sweaters|turtleneck)\b/i.test(text)) {
      const knitwear = VeloraProducts.getAll().filter(p => p.category === "knitwear");
      return {
        text: `Knitted from 12-gauge 2-ply certified Mongolian cashmere using zero-waste 3D seamless technology:`,
        products: knitwear,
        chips: ["Cashmere Turtleneck", "Sizing Consultation", "Care Guide"]
      };
    }

    // 9. Shipping & Delivery Policy
    if (/\b(shipping|delivery|courier|dispatch|timeline|freight)\b/i.test(text)) {
      return {
        text: `We provide <strong>Complimentary Insured Worldwide Delivery</strong> on all orders exceeding $250. Deliveries arrive in 1–2 days within Europe, 2–3 days to North America, and 3–5 days to Asia-Pacific via DHL Express and FedEx Priority.`,
        chips: ["Track Order", "Return Policy", "Explore Collections"]
      };
    }

    // 10. Returns & Exchanges Policy
    if (/\b(return|returns|exchange|exchanges|refund|refunds|policy)\b/i.test(text)) {
      return {
        text: `We offer <strong>30-day complimentary returns and size exchanges</strong>. Unworn items with security seals intact will be collected directly from your residence by insured courier.`,
        chips: ["Initiate Return", "Client Care", "Bestsellers"]
      };
    }

    // 11. Sustainability & Fabrics
    if (/\b(fabric|fabrics|silk|cashmere|sustainable|sustainability|organic|ethical|craft|lineage)\b/i.test(text)) {
      return {
        text: `Every VELORA piece is crafted under slow-fashion principles using GOTS-certified cashmere, Grade 6A mulberry silk, and fine deadstock wool sourced from historic heritage mills in Italy and France.`,
        chips: ["Read Our Story", "Explore Knitwear", "Contact Atelier"]
      };
    }

    // 12. Human Concierge & Flagship Salons
    if (/\b(human|agent|stylist|stylists|appointment|contact|call|email|phone|salon|salons|boutique|boutiques)\b/i.test(text)) {
      return {
        text: `Our bespoke stylist team is available for private salon consultations at our Paris, Milan, New York, and Tokyo flagships, or via video call. Contact our concierge desk at <strong>concierge@velora-couture.com</strong> or visit our <a href="contact.html" style="color:var(--color-gold); text-decoration:underline;">Client Concierge</a>.`,
        chips: ["Flagship Boutiques", "Send Message", "Sizing Consultation"]
      };
    }

    // 13. Bestsellers & Featured
    if (/\b(bestseller|bestsellers|popular|trending|recommend|recommendation|repertoire)\b/i.test(text)) {
      const featured = VeloraProducts.getFeatured().slice(0, 3);
      return {
        text: `Here are our most celebrated pieces favored by our international clientele:`,
        products: featured,
        chips: ["Cashmere Coat", "Evening Gown", "Explore Shop"]
      };
    }

    // Default Fallback
    return {
      text: `Thank you for sharing your thoughts. As your dedicated VELORA stylist, I can assist with garment recommendations, European sizing, order tracking, or booking a private salon fitting. How may I refine your selection?`,
      chips: ["Bestsellers", "Sizing Consultation", "Outerwear", "Complimentary Shipping", "Contact Stylist"]
    };
  }

  // Expose global controller
  window.VeloraChatbot = {
    open: function () {
      if (!isChatOpen) toggleChat();
    },
    close: closeChat,
    getResponse: generateBotResponse,
    handleChipClick: function (chipText) {
      if (chipText === "Bestsellers") {
        sendMessage("Show me your bestsellers");
      } else if (chipText === "Sizing Consultation" || chipText === "Outerwear Size" || chipText === "Dress Sizing") {
        sendMessage("How do your sizes and proportions fit?");
      } else if (chipText === "Track Order" || chipText === "Delivery Updates") {
        sendMessage("Where is my order? Track order VEL-749102");
      } else if (chipText === "Complimentary Shipping") {
        sendMessage("What are your worldwide shipping policies?");
      } else if (chipText === "Return Policy" || chipText === "Initiate Return") {
        sendMessage("What is your return and exchange policy?");
      } else if (chipText === "Apply Code in Bag") {
        if (window.VeloraCart) {
          window.VeloraCart.applyCoupon("VELORA15");
          window.VeloraCart.openCartDrawer();
        }
      } else if (chipText === "Explore Shop" || chipText === "All Collections" || chipText === "Explore Collections") {
        window.location.href = "shop.html";
      } else if (chipText === "Contact Stylist" || chipText === "Contact Concierge" || chipText === "Client Care" || chipText === "Send Message" || chipText === "Flagship Boutiques") {
        window.location.href = "contact.html";
      } else if (chipText === "Read Our Story") {
        window.location.href = "about.html";
      } else if (chipText === "Care Guide") {
        sendMessage("How should I care for cashmere and mulberry silk?");
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
