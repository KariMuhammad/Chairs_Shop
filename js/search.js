/**
 * Search Functionality and Quick View Modal
 */

// Sample products data - same as store.js
const searchProducts = [
  {
    id: 1,
    name: "Modern Chair Collection",
    price: 108.8,
    category: "wooden",
    rating: 5,
    image: "images/chair1.jpg",
    description:
      "Experience ultimate comfort with our modern chair collection.",
  },
  {
    id: 2,
    name: "Ergonomic Office Chair",
    price: 208.8,
    category: "office",
    rating: 4,
    image: "images/chair2.jpg",
    description: "Designed for long hours of work with exceptional support.",
  },
  {
    id: 3,
    name: "Classic Wooden Chair",
    price: 158.8,
    category: "wooden",
    rating: 5,
    image: "images/chair3.jpg",
    description: "Timeless design with premium wood craftsmanship.",
  },
  {
    id: 4,
    name: "Designer Armoire",
    price: 308.8,
    category: "armoires",
    rating: 4,
    image: "images/chair4.jpg",
    description: "Elegant storage solution for any room.",
  },
  {
    id: 5,
    name: "Comfort Plastic Chair",
    price: 78.8,
    category: "plastic",
    rating: 3,
    image: "images/chair5.jpg",
    description: "Lightweight and durable for everyday use.",
  },
  {
    id: 6,
    name: "Premium Office Chair",
    price: 258.8,
    category: "office",
    rating: 5,
    image: "images/chair6.jpg",
    description: "Luxury seating for the professional workspace.",
  },
  {
    id: 7,
    name: "Minimalist Wooden Chair",
    price: 128.8,
    category: "wooden",
    rating: 4,
    image: "images/chair1.jpg",
    description: "Simple yet elegant design for modern homes.",
  },
  {
    id: 8,
    name: "Stackable Plastic Chair",
    price: 58.8,
    category: "plastic",
    rating: 3,
    image: "images/chair2.jpg",
    description: "Space-saving solution for events and gatherings.",
  },
  {
    id: 9,
    name: "Executive Office Chair",
    price: 358.8,
    category: "office",
    rating: 5,
    image: "images/chair3.jpg",
    description: "Premium executive seating with leather upholstery.",
  },
  {
    id: 10,
    name: "Vintage Armoire Set",
    price: 458.8,
    category: "armoires",
    rating: 5,
    image: "images/chair4.jpg",
    description: "Classic vintage style with modern functionality.",
  },
];

let currentQuickViewProduct = null;

document.addEventListener("DOMContentLoaded", () => {
  initializeSearch();
  initializeQuickView();
});

// Initialize search
function initializeSearch() {
  const searchToggle = document.getElementById("searchToggle");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchClose = document.getElementById("searchClose");
  const searchInput = document.getElementById("searchInput");

  if (!searchToggle) return;

  // Open search
  searchToggle.addEventListener("click", () => {
    searchOverlay.classList.add("active");
    searchInput.focus();
  });

  // Close search
  searchClose.addEventListener("click", closeSearch);

  // Close on overlay click
  searchOverlay.addEventListener("click", (e) => {
    if (e.target === searchOverlay) {
      closeSearch();
    }
  });

  // Close on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchOverlay.classList.contains("active")) {
      closeSearch();
    }
  });

  // Search input
  searchInput.addEventListener("input", Utils.debounce(performSearch, 300));
}

// Close search
function closeSearch() {
  const searchOverlay = document.getElementById("searchOverlay");
  const searchInput = document.getElementById("searchInput");
  searchOverlay.classList.remove("active");
  searchInput.value = "";
  document.getElementById("searchResults").innerHTML = "";
}

// Perform search
function performSearch() {
  const query = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();
  const resultsContainer = document.getElementById("searchResults");

  if (!query) {
    resultsContainer.innerHTML = "";
    return;
  }

  // Filter products
  const results = searchProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
  );

  // Display results
  if (results.length === 0) {
    resultsContainer.innerHTML =
      '<div class="search-no-results">No products found</div>';
  } else {
    resultsContainer.innerHTML = results
      .map(
        (product) => `
            <div class="search-result-item" onclick="openQuickView(${
              product.id
            })">
                <img src="${product.image}" alt="${product.name}">
                <div class="info">
                    <h4>${product.name}</h4>
                    <div class="price">${Utils.formatPrice(product.price)}</div>
                </div>
            </div>
        `
      )
      .join("");
  }
}

// Initialize quick view
function initializeQuickView() {
  const quickViewClose = document.getElementById("quickViewClose");
  const quickViewModal = document.getElementById("quickViewModal");
  const quickViewAddCart = document.getElementById("quickViewAddCart");

  if (!quickViewClose) return;

  // Close quick view
  quickViewClose.addEventListener("click", closeQuickView);

  // Close on overlay click
  quickViewModal.addEventListener("click", (e) => {
    if (e.target === quickViewModal) {
      closeQuickView();
    }
  });

  // Close on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && quickViewModal.classList.contains("active")) {
      closeQuickView();
    }
  });

  // Add to cart from quick view
  quickViewAddCart.addEventListener("click", () => {
    if (currentQuickViewProduct) {
      const size = document.getElementById("quickViewSize").value;
      const color = document.getElementById("quickViewColor").value;

      CartManager.addToCart({
        ...currentQuickViewProduct,
        size,
        color,
        quantity: 1,
      });

      Utils.showNotification(`${currentQuickViewProduct.name} added to cart!`);
      Utils.animateAddToCart(quickViewAddCart);

      // Close quick view after adding
      setTimeout(closeQuickView, 1000);
    }
  });
}

// Open quick view
function openQuickView(productId) {
  const product = searchProducts.find((p) => p.id === productId);
  if (!product) return;

  currentQuickViewProduct = product;

  // Populate modal
  document.getElementById("quickViewImage").src = product.image;
  document.getElementById("quickViewName").textContent = product.name;
  document.getElementById("quickViewRating").innerHTML = generateStars(
    product.rating
  );
  document.getElementById("quickViewPrice").textContent = Utils.formatPrice(
    product.price
  );
  document.getElementById("quickViewDescription").textContent =
    product.description;
  document.getElementById(
    "quickViewFull"
  ).href = `product.html?id=${product.id}`;

  // Show modal
  document.getElementById("quickViewModal").classList.add("active");

  // Close search if open
  closeSearch();
}

// Close quick view
function closeQuickView() {
  document.getElementById("quickViewModal").classList.remove("active");
  currentQuickViewProduct = null;
}

//  Generate stars for rating
function generateStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating ? "⭐" : "☆";
  }
  return stars;
}

// Make functions global so they can be called from HTML
window.openQuickView = openQuickView;
window.closeQuickView = closeQuickView;
