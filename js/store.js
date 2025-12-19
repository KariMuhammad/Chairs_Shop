/**
 * Store Page JavaScript
 * Handles filtering, sorting, and product display
 */

// Sample products data (in a real app, this would come from an API)
const productsData = [
  {
    id: 1,
    name: "Modern Chair Collection",
    price: 108.8,
    category: "wooden",
    rating: 5,
    image: "images/chair1.jpg",
    hoverImage: "images/category-banner1.jpg",
    discount: 11,
  },
  {
    id: 2,
    name: "Ergonomic Office Chair",
    price: 208.8,
    category: "office",
    rating: 4,
    image: "images/chair2.jpg",
    hoverImage: "images/category-banner2.jpg",
    discount: 15,
  },
  {
    id: 3,
    name: "Classic Wooden Chair",
    price: 158.8,
    category: "wooden",
    rating: 5,
    image: "images/chair3.jpg",
    hoverImage: "images/category-banner3.jpg",
    discount: null,
  },
  {
    id: 4,
    name: "Designer Armoire",
    price: 308.8,
    category: "armoires",
    rating: 4,
    image: "images/chair4.jpg",
    hoverImage: "images/category-banner4.jpg",
    discount: 20,
  },
  {
    id: 5,
    name: "Comfort Plastic Chair",
    price: 78.8,
    category: "plastic",
    rating: 3,
    image: "images/chair5.jpg",
    hoverImage: "images/chair6.jpg",
    discount: 50,
  },
  {
    id: 6,
    name: "Premium Office Chair",
    price: 258.8,
    category: "office",
    rating: 5,
    image: "images/chair6.jpg",
    hoverImage: "images/chair1.jpg",
    discount: 15,
  },
  {
    id: 7,
    name: "Minimalist Wooden Chair",
    price: 128.8,
    category: "wooden",
    rating: 4,
    image: "images/chair1.jpg",
    hoverImage: "images/chair2.jpg",
    discount: null,
  },
  {
    id: 8,
    name: "Stackable Plastic Chair",
    price: 58.8,
    category: "plastic",
    rating: 3,
    image: "images/chair2.jpg",
    hoverImage: "images/chair3.jpg",
    discount: 10,
  },
  {
    id: 9,
    name: "Executive Office Chair",
    price: 358.8,
    category: "office",
    rating: 5,
    image: "images/chair3.jpg",
    hoverImage: "images/chair4.jpg",
    discount: 25,
  },
  {
    id: 10,
    name: "Vintage Armoire Set",
    price: 458.8,
    category: "armoires",
    rating: 5,
    image: "images/chair4.jpg",
    hoverImage: "images/chair5.jpg",
    discount: null,
  },
  {
    id: 11,
    name: "Modern Plastic Chair",
    price: 68.8,
    category: "plastic",
    rating: 4,
    image: "images/chair5.jpg",
    hoverImage: "images/chair6.jpg",
    discount: 5,
  },
  {
    id: 12,
    name: "Handcrafted Wooden Chair",
    price: 188.8,
    category: "wooden",
    rating: 5,
    image: "images/chair6.jpg",
    hoverImage: "images/chair1.jpg",
    discount: 12,
  },
];

// Store state
let currentFilters = {
  categories: ["all"],
  maxPrice: 500,
  minRating: 0,
  sortBy: "default",
};

let currentPage = 1;
const itemsPerPage = 9;
let currentView = "grid";

// Initialize store
document.addEventListener("DOMContentLoaded", () => {
  initializeFilters();
  initializeEventListeners();
  renderProducts();
});

// Initialize filters
function initializeFilters() {
  // Price range
  const priceRange = document.getElementById("priceRange");
  const maxPriceLabel = document.getElementById("maxPrice");

  priceRange.addEventListener("input", (e) => {
    maxPriceLabel.textContent = `$${e.target.value}`;
    currentFilters.maxPrice = parseInt(e.target.value);
    currentPage = 1;
    renderProducts();
  });

  // Category checkboxes
  document.querySelectorAll('input[name="category"]').forEach((checkbox) => {
    checkbox.addEventListener("change", handleCategoryFilter);
  });

  // Rating radio buttons
  document.querySelectorAll('input[name="rating"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      currentFilters.minRating = parseInt(e.target.value);
      currentPage = 1;
      renderProducts();
    });
  });

  // Sort dropdown
  document.getElementById("sortBy").addEventListener("change", (e) => {
    currentFilters.sortBy = e.target.value;
    renderProducts();
  });

  // Clear filters
  document
    .querySelector(".clear-filters")
    .addEventListener("click", clearAllFilters);

  // View toggle
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const view = e.currentTarget.dataset.view;
      currentView = view;

      document
        .querySelectorAll(".view-btn")
        .forEach((b) => b.classList.remove("active"));
      e.currentTarget.classList.add("active");

      const grid = document.getElementById("productsGrid");
      if (view === "list") {
        grid.classList.add("list-view");
      } else {
        grid.classList.remove("list-view");
      }
    });
  });
}

// Handle category filter
function handleCategoryFilter(e) {
  const value = e.target.value;
  const allCheckbox = document.querySelector('input[value="all"]');

  if (value === "all") {
    if (e.target.checked) {
      // Uncheck all others
      document
        .querySelectorAll('input[name="category"]:not([value="all"])')
        .forEach((cb) => {
          cb.checked = false;
        });
      currentFilters.categories = ["all"];
    }
  } else {
    // Uncheck "All"
    allCheckbox.checked = false;

    // Update categories array
    const checkedCategories = Array.from(
      document.querySelectorAll(
        'input[name="category"]:checked:not([value="all"])'
      )
    ).map((cb) => cb.value);

    currentFilters.categories =
      checkedCategories.length > 0 ? checkedCategories : ["all"];

    // If no categories, check "All"
    if (checkedCategories.length === 0) {
      allCheckbox.checked = true;
    }
  }

  currentPage = 1;
  renderProducts();
}

// Clear all filters
function clearAllFilters() {
  // Reset categories
  document
    .querySelectorAll('input[name="category"]')
    .forEach((cb) => (cb.checked = false));
  document.querySelector('input[value="all"]').checked = true;
  currentFilters.categories = ["all"];

  // Reset price
  document.getElementById("priceRange").value = 500;
  document.getElementById("maxPrice").textContent = "$500";
  currentFilters.maxPrice = 500;

  // Reset rating
  document.querySelector('input[name="rating"][value="0"]').checked = true;
  currentFilters.minRating = 0;

  // Reset sort
  document.getElementById("sortBy").value = "default";
  currentFilters.sortBy = "default";

  currentPage = 1;
  renderProducts();
}

// Filter products based on current filters
function getFilteredProducts() {
  return productsData.filter((product) => {
    // Category filter
    const categoryMatch =
      currentFilters.categories.includes("all") ||
      currentFilters.categories.includes(product.category);

    // Price filter
    const priceMatch = product.price <= currentFilters.maxPrice;

    // Rating filter
    const ratingMatch = product.rating >= currentFilters.minRating;

    return categoryMatch && priceMatch && ratingMatch;
  });
}

// Sort products
function sortProducts(products) {
  const sorted = [...products];

  switch (currentFilters.sortBy) {
    case "price-low":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    default:
      // Default order
      break;
  }

  return sorted;
}

// Render products
function renderProducts() {
  const grid = document.getElementById("productsGrid");
  const filtered = getFilteredProducts();
  const sorted = sortProducts(filtered);

  // Update count
  document.getElementById("productCount").textContent = sorted.length;

  // Update active filters display
  updateActiveFilters();

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = sorted.slice(startIndex, endIndex);

  // Render products
  if (paginatedProducts.length === 0) {
    grid.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-box-open"></i>
                <h3>No Products Found</h3>
                <p>Try adjusting your filters</p>
            </div>
        `;
  } else {
    grid.innerHTML = paginatedProducts
      .map((product) => Utils.generateProductCard(product))
      .join("");

    // Add event listeners to buttons
    initializeProductButtons();
  }

  // Render pagination
  renderPagination(sorted.length);
}

// Update active filters display
function updateActiveFilters() {
  const container = document.getElementById("activeFilters");
  const chips = [];

  // Categories
  if (!currentFilters.categories.includes("all")) {
    currentFilters.categories.forEach((cat) => {
      chips.push(`
                <div class="filter-chip">
                    ${cat}
                    <i class="fa-solid fa-xmark" onclick="removeFilter('category', '${cat}')"></i>
                </div>
            `);
    });
  }

  // Price
  if (currentFilters.maxPrice < 500) {
    chips.push(`
            <div class="filter-chip">
                Under $${currentFilters.maxPrice}
                <i class="fa-solid fa-xmark" onclick="removeFilter('price')"></i>
            </div>
        `);
  }

  // Rating
  if (currentFilters.minRating > 0) {
    chips.push(`
            <div class="filter-chip">
                ${currentFilters.minRating}★ & above
                <i class="fa-solid fa-xmark" onclick="removeFilter('rating')"></i>
            </div>
        `);
  }

  container.innerHTML = chips.join("");
}

// Remove individual filter
function removeFilter(type, value) {
  if (type === "category") {
    const checkbox = document.querySelector(`input[value="${value}"]`);
    if (checkbox) checkbox.checked = false;
    currentFilters.categories = currentFilters.categories.filter(
      (cat) => cat !== value
    );
    if (currentFilters.categories.length === 0) {
      document.querySelector('input[value="all"]').checked = true;
      currentFilters.categories = ["all"];
    }
  } else if (type === "price") {
    document.getElementById("priceRange").value = 500;
    document.getElementById("maxPrice").textContent = "$500";
    currentFilters.maxPrice = 500;
  } else if (type === "rating") {
    document.querySelector('input[name="rating"][value="0"]').checked = true;
    currentFilters.minRating = 0;
  }

  currentPage = 1;
  renderProducts();
}

// Render pagination
function renderPagination(totalItems) {
  const pagination = document.getElementById("pagination");
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  let html = `
        <button ${currentPage === 1 ? "disabled" : ""} onclick="changePage(${
    currentPage - 1
  })">
            <i class="fa-solid fa-chevron-left"></i>
        </button>
    `;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      html += `
                <button class="${
                  i === currentPage ? "active" : ""
                }" onclick="changePage(${i})">
                    ${i}
                </button>
            `;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      html += "<button disabled>...</button>";
    }
  }

  html += `
        <button ${
          currentPage === totalPages ? "disabled" : ""
        } onclick="changePage(${currentPage + 1})">
            <i class="fa-solid fa-chevron-right"></i>
        </button>
    `;

  pagination.innerHTML = html;
}

// Change page
function changePage(page) {
  currentPage = page;
  renderProducts();
  Utils.scrollToElement(".products-toolbar");
}

// Initialize product buttons
function initializeProductButtons() {
  // Add to cart buttons
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const productId = parseInt(e.currentTarget.dataset.id);
      const product = productsData.find((p) => p.id === productId);

      if (product) {
        CartManager.addToCart(product);
        Utils.showNotification(`${product.name} added to cart!`);
        Utils.animateAddToCart(e.currentTarget);
      }
    });
  });

  // Wishlist buttons
  document.querySelectorAll(".love").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const productId = parseInt(e.currentTarget.dataset.id);
      const product = productsData.find((p) => p.id === productId);

      if (product) {
        const added = CartManager.toggleWishlist(product);
        const icon = e.currentTarget.querySelector("i");

        if (added) {
          icon.classList.remove("far");
          icon.classList.add("fas");
          Utils.showNotification(`${product.name} added to wishlist!`);
        } else {
          icon.classList.remove("fas");
          icon.classList.add("far");
          Utils.showNotification(`${product.name} removed from wishlist!`);
        }
      }
    });
  });
}

// Initialize event listeners
function initializeEventListeners() {
  // Mobile filter toggle (if needed)
  const filterToggle = document.querySelector(".filter-toggle");
  if (window.innerWidth <= 992) {
    filterToggle.addEventListener("click", () => {
      const sidebar = document.querySelector(".filters-sidebar");
      sidebar.classList.toggle("mobile-open");
    });
  }
}
