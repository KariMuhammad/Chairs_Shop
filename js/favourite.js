/**
 * Favourite Page JavaScript
 */

document.addEventListener("DOMContentLoaded", () => {
  loadWishlist();
  initializeEventListeners();
});

// Load wishlist
function loadWishlist() {
  const wishlist = CartManager.getWishlist();
  const grid = document.getElementById("wishlistGrid");
  const emptyState = document.getElementById("emptyWishlist");
  const countElement = document.getElementById("wishlistCount");

  // Update count
  countElement.textContent = wishlist.length;

  // Show/hide empty state
  if (wishlist.length === 0) {
    grid.style.display = "none";
    emptyState.style.display = "block";
    document.querySelector(".wishlist-header").style.display = "none";
  } else {
    grid.style.display = "grid";
    emptyState.style.display = "none";
    document.querySelector(".wishlist-header").style.display = "flex";

    // Render wishlist items
    grid.innerHTML = wishlist.map((item) => createWishlistItem(item)).join("");

    // Add event listeners
    initializeWishlistButtons();
  }
}

// Create wishlist item HTML
function createWishlistItem(item) {
  return `
        <div class="wishlist-item" data-product-id="${item.id}">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
                <button class="remove-btn" data-id="${item.id}">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="item-details">
                <div class="rating">
                    ${generateStars(item.rating || 0)}
                </div>
                <h3 class="item-name">${item.name}</h3>
                <div class="item-price">${Utils.formatPrice(item.price)}</div>
                <div class="item-actions">
                    <button class="btn-move-cart" data-id="${item.id}">
                        <i class="fa-solid fa-cart-shopping"></i>
                        Add to Cart
                    </button>
                    <button class="btn-view" onclick="window.location.href='product.html?id=${
                      item.id
                    }'">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Generate stars
function generateStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating ? "⭐" : "☆";
  }
  return stars;
}

// Initialize event listeners
function initializeEventListeners() {
  // Clear all button
  document.getElementById("clearWishlist").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your entire wishlist?")) {
      clearWishlist();
    }
  });
}

// Initialize wishlist item buttons
function initializeWishlistButtons() {
  // Remove buttons
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = parseInt(e.currentTarget.dataset.id);
      removeFromWishlist(productId);
    });
  });

  // Move to cart buttons
  document.querySelectorAll(".btn-move-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = parseInt(e.currentTarget.dataset.id);
      moveToCart(productId);
    });
  });
}

// Remove from wishlist
function removeFromWishlist(productId) {
  CartManager.removeFromWishlist(productId);

  // Animate item removal
  const item = document.querySelector(`[data-product-id="${productId}"]`);
  if (item) {
    item.style.animation = "fadeOutDown 0.3s ease";
    setTimeout(() => {
      loadWishlist();
    }, 300);
  }

  Utils.showNotification("Item removed from wishlist");
}

// Move to cart
function moveToCart(productId) {
  const wishlist = CartManager.getWishlist();
  const product = wishlist.find((item) => item.id === productId);

  if (product) {
    // Add to cart
    CartManager.addToCart(product);

    // Remove from wishlist
    CartManager.removeFromWishlist(productId);

    Utils.showNotification(`${product.name} moved to cart!`);

    // Reload wishlist
    loadWishlist();
  }
}

// Clear wishlist
function clearWishlist() {
  const cleared = CartManager.clearWishlist();
  loadWishlist(); // Reload immediately
  if (cleared) {
    Utils.showNotification("Wishlist cleared");
  }
}

// Add CSS for fadeOut animation
const style = document.createElement("style");
style.textContent = `
    @keyframes fadeOutDown {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }
`;
document.head.appendChild(style);
