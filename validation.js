/**
 * ================================================================
 * ShopEase — Online Shopping Order Validator
 * validation.js | TOC Mini-Project | Topic 9
 * ================================================================
 *
 * THEORY OF COMPUTATION — FORMAL LANGUAGE DOCUMENTATION
 * Each field's accepted language is documented using formal notation.
 * All languages below are REGULAR LANGUAGES (Type-3 in Chomsky hierarchy).
 * They can be recognized by a Finite Automaton (DFA/NFA).
 * ================================================================
 */

/* ================================================================
 * REGEX PATTERNS — Formal Definitions
 * ================================================================ */

const REGEX = {

  /**
   * FIELD: Full Name
   * Regex:  ^[A-Za-z][A-Za-z ]{1,48}[A-Za-z]$
   * Formal: L = { w ∈ (A–Z ∪ a–z ∪ {space})* | |w| ∈ [3,50], w starts and ends with a letter }
   * DFA:    States: q0(start/letter), q1(letter/space), q2(reject)
   *         Accepts if final state ∈ {q1} and length ∈ [3,50]
   * Class:  Regular Language (can be modeled by DFA)
   *
   * Valid:   "Dhruvi Sharma", "Ravi Kumar", "Ali"
   * Invalid: " Dhruvi", "123Name", "A", "  "
   */
  fullName: /^[A-Za-z][A-Za-z ]{1,48}[A-Za-z]$|^[A-Za-z]{3,50}$/,

  /**
   * FIELD: Email Address
   * Regex:  ^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$
   * Formal: L = { local@domain.tld | local ∈ (alphanum ∪ ._%+-)+,
   *               domain ∈ (alphanum ∪ .-)+, tld ∈ (alpha){2,} }
   * DFA:    States model three phases: local-part, @, domain, dot, TLD
   * Class:  Regular Language
   *
   * Valid:   "dhruvi@gmail.com", "user.name+tag@example.co.in"
   * Invalid: "dhruvi@", "@gmail.com", "noemail"
   */
  email: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,

  /**
   * FIELD: Indian Mobile Number
   * Regex:  ^[6-9]\d{9}$
   * Formal: L = { w ∈ {0-9}^10 | w[0] ∈ {6,7,8,9} }
   * DFA:    q0 --(6|7|8|9)--> q1 --(digit x9)--> q2(accept)
   * Class:  Regular Language — classic DFA with 12 states
   *
   * Valid:   "9876543210", "6001234567", "8123456789"
   * Invalid: "1234567890", "98765", "abcdefghij"
   */
  mobile: /^[6-9]\d{9}$/,

  /**
   * FIELD: Order ID
   * Regex:  ^ORD-[A-Z0-9]{8}$
   * Formal: L = { "ORD-" ∘ w | w ∈ (A–Z ∪ 0–9)^8 }
   * DFA:    Matches literal prefix "ORD-" then exactly 8 alphanumeric chars
   * Class:  Regular Language (finite-length, fixed structure)
   *
   * Valid:   "ORD-AB12CD34", "ORD-00000000", "ORD-XXXXXXXX"
   * Invalid: "ord-AB12CD34", "ORD-ABC", "ORDER-12345678"
   */
  orderId: /^ORD-[A-Z0-9]{8}$/,

  /**
   * FIELD: Quantity
   * Regex:  ^([1-9]|[1-9][0-9])$
   * Formal: L = { w ∈ {0-9}* | 1 ≤ val(w) ≤ 99 }
   * DFA:    Accepts single non-zero digit OR two-digit number with non-zero first digit
   * Class:  Regular Language
   *
   * Valid:   "1", "50", "99"
   * Invalid: "0", "100", "abc"
   */
  quantity: /^([1-9]|[1-9][0-9])$/,

  /**
   * FIELD: Indian Pincode
   * Regex:  ^[1-9][0-9]{5}$
   * Formal: L = { w ∈ {0-9}^6 | w[0] ∈ {1-9} }
   * DFA:    q0 --(1..9)--> q1 --(digit x5)--> q2(accept)
   * Class:  Regular Language
   *
   * Valid:   "411001", "110001", "560068"
   * Invalid: "011001", "4110", "abcdef"
   */
  pincode: /^[1-9][0-9]{5}$/,

  /**
   * FIELD: Delivery Date (DD/MM/YYYY)
   * Regex:  ^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$
   * Formal: L = { DD/MM/YYYY | DD ∈ {01..31}, MM ∈ {01..12}, YYYY ∈ {0000..9999} }
   * DFA:    Models digit-by-digit constraints for day, month, year with separators
   * Class:  Regular Language (structural validation; leap years need extra logic)
   *
   * Valid:   "19/04/2026", "31/12/2025", "01/01/2027"
   * Invalid: "32/01/2026", "19-04-2026", "2026/04/19"
   */
  deliveryDate: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,

  /**
   * FIELD: Coupon Code (Optional)
   * Regex:  ^[A-Z0-9]{5,10}$
   * Formal: L = { w ∈ (A–Z ∪ 0–9)* | 5 ≤ |w| ≤ 10 }
   * DFA:    Accepts uppercase letters and digits with length constraint
   * Class:  Regular Language
   *
   * Valid:   "SAVE20", "FEST2025", "DEAL50OFF"
   * Invalid: "save20", "HI", "TOOLONGCOUPONCODE123"
   */
  coupon: /^[A-Z0-9]{5,10}$/,

  /**
   * FIELD: UPI ID
   * Regex:  ^[a-zA-Z0-9._\-]+@[a-zA-Z]{3,}$
   * Formal: L = { handle@provider | handle ∈ (alphanum ∪ ._-)+,
   *               provider ∈ (alpha){3,} }
   * DFA:    Two-phase: handle characters then @ then alphabetic provider
   * Class:  Regular Language
   *
   * Valid:   "dhruvi@okicici", "9876543210@paytm", "user.name@ybl"
   * Invalid: "dhruvi", "@okicici", "user@12"
   */
  upiId: /^[a-zA-Z0-9._\-]+@[a-zA-Z]{3,}$/,

  /**
   * FIELD: Card Number (16 digits, spaces allowed)
   * Regex:  ^(\d{4}\s){3}\d{4}$|^\d{16}$
   * Formal: L = { w ∈ {0-9, space}* | strip(w) ∈ {0-9}^16 }
   * DFA:    Accepts 16 continuous digits or groups of 4 separated by spaces
   * Class:  Regular Language
   *
   * Valid:   "4111 1111 1111 1111", "4111111111111111"
   * Invalid: "4111-1111-1111-1111", "1234", "abcdabcdabcdabcd"
   */
  cardNumber: /^(\d{4}\s){3}\d{4}$|^\d{16}$/,

  /**
   * FIELD: Card Expiry (MM/YY)
   * Regex:  ^(0[1-9]|1[0-2])\/([2-9]\d)$
   * Formal: L = { MM/YY | MM ∈ {01..12}, YY ∈ {20..99} (current century) }
   * DFA:    Fixed structure: two-digit month / two-digit year
   * Class:  Regular Language
   *
   * Valid:   "04/26", "12/30", "01/25"
   * Invalid: "13/26", "4/26", "04-26"
   */
  cardExpiry: /^(0[1-9]|1[0-2])\/([2-9]\d)$/,

  /**
   * FIELD: CVV
   * Regex:  ^\d{3,4}$
   * Formal: L = { w ∈ {0-9}^3 ∪ {0-9}^4 }
   * DFA:    Simple length-bounded digit sequence
   * Class:  Regular Language
   *
   * Valid:   "123", "9876"
   * Invalid: "12", "12345", "abc"
   */
  cvv: /^\d{3,4}$/
};

/* ================================================================
 * ERROR MESSAGES
 * ================================================================ */
const ERRORS = {
  fullName:     "❌ Only letters and spaces, 3–50 characters. Must start and end with a letter.",
  email:        "❌ Enter a valid email: someone@domain.com",
  mobile:       "❌ Must be 10 digits starting with 6, 7, 8, or 9.",
  orderId:      "❌ Format must be ORD- followed by exactly 8 uppercase letters/digits.",
  quantity:     "❌ Quantity must be a number between 1 and 99.",
  pincode:      "❌ Must be a 6-digit Indian pincode (first digit cannot be 0).",
  deliveryDate: "❌ Use DD/MM/YYYY format. Date must be in the future.",
  coupon:       "❌ Coupon must be 5–10 uppercase letters/digits (or leave blank).",
  upiId:        "❌ Format: handle@provider (e.g. dhruvi@okicici)",
  cardNumber:   "❌ Enter a valid 16-digit card number (e.g. 4111 1111 1111 1111).",
  cardExpiry:   "❌ Enter expiry as MM/YY (e.g. 04/28). Must not be expired.",
  cvv:          "❌ CVV must be 3 or 4 digits."
};

const SUCCESS = {
  fullName:     "✅ Looks good!",
  email:        "✅ Valid email address.",
  mobile:       "✅ Valid Indian mobile number.",
  orderId:      "✅ Order ID format is correct.",
  quantity:     "✅ Quantity accepted.",
  pincode:      "✅ Valid pincode.",
  deliveryDate: "✅ Delivery date is valid.",
  coupon:       "✅ Coupon code looks valid!",
  upiId:        "✅ Valid UPI ID.",
  cardNumber:   "✅ Card number format accepted.",
  cardExpiry:   "✅ Expiry date valid.",
  cvv:          "✅ CVV accepted."
};

/* ================================================================
 * STATE
 * ================================================================ */
let currentSection = 1;
let paymentMode    = "upi";

const sectionFields = {
  1: ["fullName", "email", "mobile"],
  2: ["orderId", "quantity", "pincode", "deliveryDate"],  // coupon optional
  3: []  // determined dynamically
};

/* ================================================================
 * VALIDATION HELPERS
 * ================================================================ */

/** Validate a single field, show/clear messages, return true/false */
function validateField(id, value) {
  const input   = document.getElementById(id);
  const errEl   = document.getElementById("err-" + id);
  const okEl    = document.getElementById("ok-"  + id);
  const iconEl  = document.getElementById("icon-" + id);

  if (!input) return true;

  // Coupon is optional — skip if blank
  if (id === "coupon" && value.trim() === "") {
    clearState(id); return true;
  }

  let isValid = false;

  // Extra check for delivery date: must be a future date
  if (id === "deliveryDate") {
    if (REGEX.deliveryDate.test(value)) {
      const parts = value.split("/");
      const inputDate = new Date(
        parseInt(parts[2]),
        parseInt(parts[1]) - 1,
        parseInt(parts[0])
      );
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      isValid = inputDate > today;
      if (!isValid && REGEX.deliveryDate.test(value)) {
        // Format valid but date in past
        showError(id, "❌ Delivery date must be a future date.");
        return false;
      }
    }
  }

  // Extra check for card expiry: must not be expired
  if (id === "cardExpiry") {
    if (REGEX.cardExpiry.test(value)) {
      const parts  = value.split("/");
      const month  = parseInt(parts[0]);
      const year   = parseInt("20" + parts[1]);
      const now    = new Date();
      const expiry = new Date(year, month, 1);
      isValid = expiry > now;
      if (!isValid) {
        showError(id, "❌ This card appears to be expired.");
        return false;
      }
    }
  }

  isValid = REGEX[id] ? REGEX[id].test(value) : true;

  if (isValid) {
    input.classList.remove("invalid");
    input.classList.add("valid");
    if (errEl) errEl.textContent = "";
    if (okEl)  okEl.textContent  = SUCCESS[id] || "✅ Valid";
    if (iconEl) iconEl.textContent = "✅";
  } else {
    showError(id, ERRORS[id] || "❌ Invalid input.");
  }

  return isValid;
}

function showError(id, msg) {
  const input  = document.getElementById(id);
  const errEl  = document.getElementById("err-" + id);
  const okEl   = document.getElementById("ok-"  + id);
  const iconEl = document.getElementById("icon-" + id);

  if (input)  { input.classList.remove("valid"); input.classList.add("invalid"); }
  if (errEl)  errEl.textContent = msg;
  if (okEl)   okEl.textContent  = "";
  if (iconEl) iconEl.textContent = "❌";
}

function clearState(id) {
  const input  = document.getElementById(id);
  const errEl  = document.getElementById("err-" + id);
  const okEl   = document.getElementById("ok-"  + id);
  const iconEl = document.getElementById("icon-" + id);
  if (input)  { input.classList.remove("valid", "invalid"); }
  if (errEl)  errEl.textContent = "";
  if (okEl)   okEl.textContent  = "";
  if (iconEl) iconEl.textContent = "";
}

/* ================================================================
 * REAL-TIME EVENT LISTENERS
 * ================================================================ */
document.addEventListener("DOMContentLoaded", function () {

  const fields = [
    "fullName","email","mobile",
    "orderId","quantity","pincode","deliveryDate","coupon",
    "upiId","cardNumber","cardExpiry","cvv"
  ];

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    // Auto-uppercase for orderId and coupon
    if (id === "orderId" || id === "coupon") {
      el.addEventListener("input", () => {
        const pos = el.selectionStart;
        el.value = el.value.toUpperCase();
        el.setSelectionRange(pos, pos);
      });
    }

    // Auto-format card number with spaces
    if (id === "cardNumber") {
      el.addEventListener("input", () => {
        let v = el.value.replace(/\D/g, "").substring(0, 16);
        el.value = v.replace(/(.{4})/g, "$1 ").trim();
      });
    }

    // Auto-format expiry with /
    if (id === "cardExpiry") {
      el.addEventListener("input", () => {
        let v = el.value.replace(/\D/g, "").substring(0, 4);
        if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
        el.value = v;
      });
    }

    // Auto-format date with /
    if (id === "deliveryDate") {
      el.addEventListener("input", () => {
        let v = el.value.replace(/\D/g, "").substring(0, 8);
        if (v.length > 4) v = v.slice(0, 2) + "/" + v.slice(2, 4) + "/" + v.slice(4);
        else if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
        el.value = v;
      });
    }

    // Validate on blur (when user leaves field)
    el.addEventListener("blur", () => {
      if (el.value.trim() !== "" || id === "coupon") {
        validateField(id, el.value.trim());
      }
    });

    // Live validate when typing (after first interaction)
    el.addEventListener("input", () => {
      if (el.classList.contains("valid") || el.classList.contains("invalid")) {
        if (el.value.trim() === "" && id !== "coupon") {
          clearState(id);
        } else {
          validateField(id, el.value.trim());
        }
      }
    });
  });

  // Form submit
  document.getElementById("orderForm").addEventListener("submit", handleSubmit);
});

/* ================================================================
 * NAVIGATION — Move between sections
 * ================================================================ */
function goToSection(target) {
  if (target > currentSection) {
    // Validate current section before proceeding
    const fields = sectionFields[currentSection];
    let allValid = true;

    fields.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const isValid = validateField(id, el.value.trim());
      if (!isValid) allValid = false;
    });

    if (!allValid) {
      // Shake the Next button
      const btn = document.getElementById("btn-next-" + currentSection);
      if (btn) {
        btn.style.animation = "none";
        btn.offsetHeight; // reflow
        btn.style.animation = "shake 0.4s ease";
      }
      return;
    }
  }

  // Hide current section
  document.getElementById("section-" + currentSection).classList.remove("active-section");

  // Update progress bar
  updateProgress(currentSection, target);

  currentSection = target;

  // Show new section
  document.getElementById("section-" + currentSection).classList.add("active-section");

  // Scroll to top of form
  document.querySelector(".form-card").scrollIntoView({ behavior: "smooth", block: "start" });
}

function updateProgress(from, to) {
  // Mark completed steps
  for (let i = 1; i <= 3; i++) {
    const step = document.getElementById("step-indicator-" + i);
    step.classList.remove("active", "done");
    if (i < to) step.classList.add("done");
    else if (i === to) step.classList.add("active");
  }
  // Fill lines
  for (let i = 1; i <= 2; i++) {
    const line = document.getElementById("line-" + i);
    if (i < to) line.classList.add("filled");
    else line.classList.remove("filled");
  }
}

/* ================================================================
 * PAYMENT SWITCH
 * ================================================================ */
function switchPayment(mode) {
  paymentMode = mode;

  document.getElementById("toggle-upi").classList.toggle("active",  mode === "upi");
  document.getElementById("toggle-card").classList.toggle("active", mode === "card");
  document.getElementById("upi-fields").classList.toggle("hidden",  mode !== "upi");
  document.getElementById("card-fields").classList.toggle("hidden", mode !== "card");

  // Clear validation state on switch
  ["upiId","cardNumber","cardExpiry","cvv"].forEach(id => clearState(id));
}

/* ================================================================
 * FORM SUBMIT
 * ================================================================ */
function handleSubmit(e) {
  e.preventDefault();

  // Determine which payment fields to validate
  let payFields = paymentMode === "upi"
    ? ["upiId"]
    : ["cardNumber", "cardExpiry", "cvv"];

  let allValid = true;
  payFields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (!validateField(id, el.value.trim())) allValid = false;
  });

  if (!allValid) return;

  // Simulate processing
  const btnText   = document.querySelector(".btn-text");
  const btnLoader = document.getElementById("submitLoader");
  btnText.classList.add("hidden");
  btnLoader.classList.remove("hidden");

  setTimeout(() => {
    showSuccessScreen();
  }, 1500);
}

/* ================================================================
 * SUCCESS SCREEN
 * ================================================================ */
function showSuccessScreen() {
  document.getElementById("orderForm").classList.add("hidden");

  const name     = document.getElementById("fullName").value;
  const email    = document.getElementById("email").value;
  const orderId  = document.getElementById("orderId").value;
  const qty      = document.getElementById("quantity").value;
  const pincode  = document.getElementById("pincode").value;
  const date     = document.getElementById("deliveryDate").value;
  const payment  = paymentMode === "upi"
    ? document.getElementById("upiId").value
    : "**** **** **** " + document.getElementById("cardNumber").value.replace(/\s/g,"").slice(-4);

  document.getElementById("orderSummary").innerHTML = `
    <div class="order-summary-item"><span class="label">Customer</span><span class="value">${escapeHtml(name)}</span></div>
    <div class="order-summary-item"><span class="label">Email</span><span class="value">${escapeHtml(email)}</span></div>
    <div class="order-summary-item"><span class="label">Order ID</span><span class="value">${escapeHtml(orderId)}</span></div>
    <div class="order-summary-item"><span class="label">Quantity</span><span class="value">${escapeHtml(qty)} unit(s)</span></div>
    <div class="order-summary-item"><span class="label">Delivery Pincode</span><span class="value">${escapeHtml(pincode)}</span></div>
    <div class="order-summary-item"><span class="label">Delivery Date</span><span class="value">${escapeHtml(date)}</span></div>
    <div class="order-summary-item"><span class="label">Payment</span><span class="value">${escapeHtml(payment)}</span></div>
    <div class="order-summary-item"><span class="label">Status</span><span class="value" style="color:var(--success)">✅ Confirmed</span></div>
  `;

  document.getElementById("successScreen").classList.remove("hidden");

  // Update progress to show all done
  updateProgress(3, 4);
}

/* ================================================================
 * RESET
 * ================================================================ */
function resetForm() {
  document.getElementById("orderForm").reset();
  document.getElementById("orderForm").classList.remove("hidden");
  document.getElementById("successScreen").classList.add("hidden");

  ["fullName","email","mobile","orderId","quantity","pincode","deliveryDate",
   "coupon","upiId","cardNumber","cardExpiry","cvv"].forEach(clearState);

  currentSection = 1;
  goToSection(1);
  switchPayment("upi");
  updateProgress(0, 1);
}

/* ================================================================
 * UTILITY
 * ================================================================ */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Shake animation (injected via JS to avoid CSS duplication)
const style = document.createElement("style");
style.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-8px); }
    40%     { transform: translateX(8px); }
    60%     { transform: translateX(-5px); }
    80%     { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);
