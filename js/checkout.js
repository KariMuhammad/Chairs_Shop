/**
 * Checkout Page JavaScript
 */

document.addEventListener("DOMContentLoaded", () => {
  // Check if cart is empty
  const cart = CartManager.getCart();
  if (cart.length === 0) {
    window.location.href = "cart.html";
    return;
  }

  loadOrderSummary();
  initializeEventListeners();
});

// Load order summary
function loadOrderSummary() {
  const cart = CartManager.getCart();
  const summaryItems = document.getElementById("summaryItems");

  // Render items
  summaryItems.innerHTML = cart
    .map(
      (item) => `
        <div class="summary-item">
            <div class="summary-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="summary-item-details">
                <div class="summary-item-name">${item.name}</div>
                <div class="summary-item-meta">
                    ${item.size} | ${item.color} | Qty: ${item.quantity}
                </div>
            </div>
            <div class="summary-item-price">
                ${Utils.formatPrice(item.price * item.quantity)}
            </div>
        </div>
    `
    )
    .join("");

  // Calculate totals
  const subtotal = CartManager.getCartTotal();
  const shipping = parseFloat(localStorage.getItem("selectedShipping") || "0");
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  // Update totals
  document.getElementById("summarySubtotal").textContent =
    Utils.formatPrice(subtotal);
  document.getElementById("summaryShipping").textContent =
    Utils.formatPrice(shipping);
  document.getElementById("summaryTax").textContent = Utils.formatPrice(tax);
  document.getElementById("summaryTotal").textContent =
    Utils.formatPrice(total);
}

// Initialize event listeners
function initializeEventListeners() {
  // Billing address toggle
  document.getElementById("sameAsShipping").addEventListener("change", (e) => {
    const billingFields = document.getElementById("billingFields");
    billingFields.style.display = e.target.checked ? "none" : "block";
  });

  // Payment method selection
  document.querySelectorAll('input[name="payment"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const cardDetails = document.getElementById("cardDetails");
      cardDetails.style.display = e.target.value === "card" ? "block" : "none";
    });
  });

  // Place order
  document
    .getElementById("placeOrderBtn")
    .addEventListener("click", placeOrder);
}

// Validate form
function validateForm() {
  const requiredFields = [
    { id: "firstName", name: "First Name" },
    { id: "lastName", name: "Last Name" },
    { id: "email", name: "Email" },
    { id: "phone", name: "Phone" },
    { id: "address", name: "Address" },
    { id: "city", name: "City" },
    { id: "state", name: "State" },
    { id: "zip", name: "ZIP Code" },
    { id: "country", name: "Country" },
  ];

  // Clear previous errors
  document.querySelectorAll(".error").forEach((el) => {
    Utils.clearFieldError(el);
  });

  let isValid = true;

  for (const field of requiredFields) {
    const input = document.getElementById(field.id);
    const value = input.value.trim();

    if (!value) {
      Utils.showFieldError(input, `${field.name} is required`);
      isValid = false;
    } else if (field.id === "email" && !Utils.validateEmail(value)) {
      Utils.showFieldError(input, "Please enter a valid email");
      isValid = false;
    } else if (field.id === "phone" && !Utils.validatePhone(value)) {
      Utils.showFieldError(input, "Please enter a valid phone number");
      isValid = false;
    } else {
      Utils.clearFieldError(input);
    }
  }

  // Validate card details if card payment is selected
  const paymentMethod = document.querySelector(
    'input[name="payment"]:checked'
  ).value;
  if (paymentMethod === "card") {
    const cardNumber = document.getElementById("cardNumber").value.trim();
    const expiryDate = document.getElementById("expiryDate").value.trim();
    const cvv = document.getElementById("cvv").value.trim();

    if (!cardNumber || cardNumber.replace(/\s/g, "").length < 13) {
      Utils.showFieldError(
        document.getElementById("cardNumber"),
        "Invalid card number"
      );
      isValid = false;
    }

    if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
      Utils.showFieldError(
        document.getElementById("expiryDate"),
        "Enter date as MM/YY"
      );
      isValid = false;
    }

    if (!cvv || cvv.length < 3) {
      Utils.showFieldError(document.getElementById("cvv"), "Invalid CVV");
      isValid = false;
    }
  }

  return isValid;
}

// Place order
function placeOrder() {
  if (!validateForm()) {
    Utils.showNotification("Please fix the errors in the form", "error");
    return;
  }

  // Collect form data
  const orderData = {
    shipping: {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      state: document.getElementById("state").value,
      zip: document.getElementById("zip").value,
      country: document.getElementById("country").value,
    },
    payment: document.querySelector('input[name="payment"]:checked').value,
    cart: CartManager.getCart(),
    timestamp: new Date().toISOString(),
  };

  // Simulate order processing
  const btn = document.getElementById("placeOrderBtn");
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

  setTimeout(() => {
    // Clear cart
    CartManager.clearCart();

    // Redirect to success page (or show success message)
    alert(
      "Order placed successfully! Thank you for your purchase.\n\nOrder ID: #" +
        Math.random().toString(36).substr(2, 9).toUpperCase()
    );
    window.location.href = "index.html";
  }, 2000);
}
