/**
 * Utility Functions for Chairs Shop
 */

const Utils = {
  // Format price
  formatPrice(price) {
    return `$${parseFloat(price).toFixed(2)}`;
  },

  // Generate star rating HTML
  generateStars(rating) {
    let starsHTML = '<div class="rate">';
    for (let i = 1; i <= 5; i++) {
      const activeClass = i <= rating ? "active" : "";
      starsHTML += `<i><i class="${activeClass} fa-solid fa-star"></i></i>`;
    }
    starsHTML += "</div>";
    return starsHTML;
  },

  // Show notification toast
  showNotification(message, type = "success") {
    // Remove existing notification
    const existing = document.querySelector(".notification-toast");
    if (existing) {
      existing.remove();
    }

    // Create notification
    const toast = document.createElement("div");
    toast.className = `notification-toast ${type}`;
    toast.innerHTML = `
            <i class="fa-solid ${
              type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
            }"></i>
            <span>${message}</span>
        `;
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add("show"), 10);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  // Smooth scroll to element
  scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  },

  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Generate product card HTML
  generateProductCard(product) {
    const isInWishlist = CartManager.isInWishlist(product.id);
    const heartClass = isInWishlist ? "fas" : "far";

    return `
            <div class="prod" data-product-id="${product.id}">
                ${product.discount ? `<h5 class="state">sale</h5>` : ""}
                <a href="product.html?id=${product.id}" class="image-product">
                    <img src="${product.image}" alt="${product.name}">
                    ${
                      product.hoverImage
                        ? `<img src="${product.hoverImage}" alt="${product.name}">`
                        : ""
                    }
                </a>
                
                <div class="buttons">
                    <button class="love" data-id="${
                      product.id
                    }" title="Add to Wishlist">
                        <i class="${heartClass} fa-heart"></i>
                    </button>
                    <button class="view" onclick="window.location.href='product.html?id=${
                      product.id
                    }'" title="View Details">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button class="add-to-cart" data-id="${
                      product.id
                    }" title="Add to Cart">
                        <i class="fa-solid fa-cart-shopping"></i>
                    </button>
                </div>

                <div class="text">
                    ${this.generateStars(product.rating || 0)}
                    <h4 class="name">${product.name}</h4>
                    <h5 class="price">${this.formatPrice(product.price)}</h5>
                    ${
                      product.discount
                        ? `<h5 class="discount">${product.discount}</h5>`
                        : ""
                    }
                </div>
            </div>
        `;
  },

  // Validate email
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  // Validate phone
  validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, "").length >= 10;
  },

  // Validate form field
  validateField(field, value) {
    const validations = {
      email: this.validateEmail(value),
      phone: this.validatePhone(value),
      required: value.trim() !== "",
      minLength: (min) => value.length >= min,
      maxLength: (max) => value.length <= max,
    };

    return validations[field] !== undefined ? validations[field] : true;
  },

  // Show field error
  showFieldError(input, message) {
    const errorEl =
      input.parentElement.querySelector(".error-message") ||
      document.createElement("span");
    errorEl.className = "error-message";
    errorEl.textContent = message;

    if (!input.parentElement.querySelector(".error-message")) {
      input.parentElement.appendChild(errorEl);
    }

    input.classList.add("error");
  },

  // Clear field error
  clearFieldError(input) {
    const errorEl = input.parentElement.querySelector(".error-message");
    if (errorEl) {
      errorEl.remove();
    }
    input.classList.remove("error");
  },

  // Get URL parameter
  getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  },

  // Add to cart animation
  animateAddToCart(button) {
    const cartIcon = document.querySelector(".fa-cart-shopping");
    if (!cartIcon || !button) return;

    // Create flying icon
    const flyIcon = document.createElement("i");
    flyIcon.className = "fa-solid fa-shopping-cart flying-cart";
    flyIcon.style.position = "fixed";

    const buttonRect = button.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    flyIcon.style.left = buttonRect.left + "px";
    flyIcon.style.top = buttonRect.top + "px";

    document.body.appendChild(flyIcon);

    // Animate to cart
    setTimeout(() => {
      flyIcon.style.transition = "all 0.8s ease-in-out";
      flyIcon.style.left = cartRect.left + "px";
      flyIcon.style.top = cartRect.top + "px";
      flyIcon.style.opacity = "0";
      flyIcon.style.transform = "scale(0.5)";
    }, 10);

    // Remove after animation
    setTimeout(() => {
      flyIcon.remove();
      cartIcon.parentElement.classList.add("bounce");
      setTimeout(() => cartIcon.parentElement.classList.remove("bounce"), 500);
    }, 850);
  },
};

// Add global styles for notifications
const notificationStyles = document.createElement("style");
notificationStyles.textContent = `
    .notification-toast {
        position: fixed;
        top: 100px;
        right: -300px;
        background: #fff;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        transition: right 0.3s ease;
        min-width: 250px;
    }
    
    .notification-toast.show {
        right: 20px;
    }
    
    .notification-toast.success {
        border-left: 4px solid #7b5244;
    }
    
    .notification-toast.success i {
        color: #7b5244;
        font-size: 20px;
    }
    
    .notification-toast.error {
        border-left: 4px solid #dc3545;
    }
    
    .notification-toast.error i {
        color: #dc3545;
        font-size: 20px;
    }
    
    .error-message {
        color: #dc3545;
        font-size: 12px;
        display: block;
        margin-top: 5px;
    }
    
    input.error,
    textarea.error,
    select.error {
        border-color: #dc3545 !important;
    }
    
    .flying-cart {
        font-size: 24px;
        color: #7b5244;
        pointer-events: none;
        z-index: 9999;
    }
    
    .bounce {
        animation: bounce 0.5s;
    }
    
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
`;
document.head.appendChild(notificationStyles);
