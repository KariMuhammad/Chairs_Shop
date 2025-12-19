/**
 * Cart Page JavaScript
 */

// Available coupons (in real app, this would be validated server-side)
const coupons = {
  SAVE10: 10, // 10% off
  SAVE20: 20, // 20% off
  WELCOME: 15, // 15% off
};

let appliedCoupon = null;
let shipping = 0;

document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  initializeEventListeners();
});

// Load cart
function loadCart() {
  const cart = CartManager.getCart();
  const itemsList = document.getElementById("cartItemsList");
  const emptyCart = document.getElementById("emptyCart");
  const checkoutBtn = document.getElementById("checkoutBtn");

  // Update count
  document.getElementById("cartItemCount").textContent = cart.length;

  // Show/hide cart
  if (cart.length === 0) {
    itemsList.style.display = "none";
    emptyCart.style.display = "block";
    document.querySelector(".cart-summary").style.display = "none";
    checkoutBtn.disabled = true;
  } else {
    itemsList.style.display = "flex";
    emptyCart.style.display = "none";
    document.querySelector(".cart-summary").style.display = "block";
    checkoutBtn.disabled = false;

    // Render cart items
    itemsList.innerHTML = cart.map((item) => createCartItem(item)).join("");

    // Initialize item controls
    initializeCartControls();

    // Update summary
    updateCartSummary();
  }
}

// Create cart item HTML
function createCartItem(item) {
  return `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-name">${item.name}</h3>
                <div class="cart-item-meta">
                    <span>Size: ${item.size}</span>
                    <span>Color: ${item.color}</span>
                </div>
                <div class="cart-item-price">${Utils.formatPrice(
                  item.price
                )}</div>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="qty-btn decrease" data-id="${
                      item.id
                    }" data-size="${item.size}" data-color="${
    item.color
  }">-</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn increase" data-id="${
                      item.id
                    }" data-size="${item.size}" data-color="${
    item.color
  }">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}" data-size="${
    item.size
  }" data-color="${item.color}">
                    <i class="fa-solid fa-trash"></i>
                    Remove
                </button>
            </div>
        </div>
    `;
}

// Initialize cart controls
function initializeCartControls() {
  // Decrease quantity
  document.querySelectorAll(".qty-btn.decrease").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.currentTarget.dataset.id);
      const size = e.currentTarget.dataset.size;
      const color = e.currentTarget.dataset.color;
      const cart = CartManager.getCart();
      const item = cart.find(
        (i) => i.id === id && i.size === size && i.color === color
      );

      if (item && item.quantity > 1) {
        CartManager.updateQuantity(id, size, color, item.quantity - 1);
        loadCart();
      }
    });
  });

  // Increase quantity
  document.querySelectorAll(".qty-btn.increase").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.currentTarget.dataset.id);
      const size = e.currentTarget.dataset.size;
      const color = e.currentTarget.dataset.color;
      const cart = CartManager.getCart();
      const item = cart.find(
        (i) => i.id === id && i.size === size && i.color === color
      );

      if (item) {
        CartManager.updateQuantity(id, size, color, item.quantity + 1);
        loadCart();
      }
    });
  });

  // Remove item
  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.currentTarget.dataset.id);
      const size = e.currentTarget.dataset.size;
      const color = e.currentTarget.dataset.color;

      if (confirm("Remove this item from cart?")) {
        const removed = CartManager.removeFromCart(id, size, color);
        if (removed) {
          loadCart();
          Utils.showNotification("Item removed from cart");
        } else {
          console.error("Failed to remove item", id, size, color);
          Utils.showNotification("Failed to remove item", "error");
        }
      }
    });
  });
}

// Update cart summary
function updateCartSummary() {
  const subtotal = CartManager.getCartTotal();
  const taxRate = 0.1; // 10% tax
  const tax = subtotal * taxRate;

  // Calculate discount
  let discount = 0;
  if (appliedCoupon) {
    discount = subtotal * (appliedCoupon / 100);
  }

  const total = subtotal + shipping + tax - discount;

  // Update display
  document.getElementById("subtotal").textContent = Utils.formatPrice(subtotal);
  document.getElementById("tax").textContent = Utils.formatPrice(tax);
  document.getElementById("total").textContent = Utils.formatPrice(total);

  // Show/hide discount
  if (discount > 0) {
    document.getElementById("discountRow").style.display = "flex";
    document.getElementById("discount").textContent = `-${Utils.formatPrice(
      discount
    )}`;
  } else {
    document.getElementById("discountRow").style.display = "none";
  }
}

// Initialize event listeners
function initializeEventListeners() {
  // Shipping method change
  document.getElementById("shippingMethod").addEventListener("change", (e) => {
    shipping = parseFloat(e.target.value);
    updateCartSummary();
  });

  // Apply coupon
  document.getElementById("applyCoupon").addEventListener("click", () => {
    const code = document
      .getElementById("couponCode")
      .value.trim()
      .toUpperCase();

    if (coupons[code]) {
      appliedCoupon = coupons[code];
      Utils.showNotification(`Coupon applied! ${appliedCoupon}% off`);
      updateCartSummary();
      document.getElementById("couponCode").value = "";
      document.getElementById("couponCode").disabled = true;
      document.getElementById("applyCoupon").textContent = "Applied";
      document.getElementById("applyCoupon").disabled = true;
    } else if (code) {
      Utils.showNotification("Invalid coupon code", "error");
    }
  });

  // Checkout
  document.getElementById("checkoutBtn").addEventListener("click", () => {
    const cart = CartManager.getCart();
    if (cart.length > 0) {
      window.location.href = "checkout.html";
    }
  });
}
