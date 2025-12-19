/**
 * Product Page JavaScript
 */

// Sample product details (in real app, this would come from an API)
const productDetails = {
  1: {
    name: "Modern Chair Collection",
    price: 108.8,
    oldPrice: 122.0,
    discount: 11,
    category: "wooden",
    rating: 5,
    sku: "CHR-001",
    images: [
      "images/chair1.jpg",
      "images/category-banner1.jpg",
      "images/chair2.jpg",
      "images/chair3.jpg",
    ],
    description:
      "Experience ultimate comfort with our modern chair collection. Crafted with premium materials and designed for both style and functionality.",
  },
  2: {
    name: "Ergonomic Office Chair",
    price: 208.8,
    oldPrice: 245.0,
    discount: 15,
    category: "office",
    rating: 4,
    sku: "CHR-002",
    images: [
      "images/chair2.jpg",
      "images/category-banner2.jpg",
      "images/chair3.jpg",
      "images/chair4.jpg",
    ],
    description:
      "Designed for long hours of work, this ergonomic office chair provides exceptional lumbar support and comfort.",
  },
};

// Related products
const relatedProducts = [
  {
    id: 3,
    name: "Classic Wooden Chair",
    price: 158.8,
    category: "wooden",
    rating: 5,
    image: "images/chair3.jpg",
    hoverImage: "images/category-banner3.jpg",
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
];

// Current state
let currentProduct = null;
let selectedSize = "Small";
let selectedColor = "Brown";
let quantity = 1;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  const productId = Utils.getUrlParameter("id") || "1";
  loadProduct(productId);
  initializeEventListeners();
  loadRelatedProducts();
});

// Load product details
function loadProduct(id) {
  currentProduct = productDetails[id] || productDetails[1];

  // Update page title
  document.title = `${currentProduct.name} - Chairs Shop`;

  // Update breadcrumb
  document.getElementById("productName").textContent = currentProduct.name;

  // Update product info
  document.getElementById("productTitle").textContent = currentProduct.name;
  document.getElementById("currentPrice").textContent = Utils.formatPrice(
    currentProduct.price
  );
  document.getElementById("productDescription").textContent =
    currentProduct.description;
  document.getElementById("productSKU").textContent = currentProduct.sku;
  document.getElementById("productCategory").textContent =
    currentProduct.category.replace("-", " ");

  // Update old price and discount
  if (currentProduct.discount) {
    document.getElementById("oldPrice").textContent = Utils.formatPrice(
      currentProduct.oldPrice
    );
    document.getElementById(
      "discountBadge"
    ).textContent = `-${currentProduct.discount}%`;
  } else {
    document.getElementById("oldPrice").style.display = "none";
    document.getElementById("discountBadge").style.display = "none";
  }

  // Update rating
  document.getElementById("productStars").innerHTML = Utils.generateStars(
    currentProduct.rating
  );

  // Load images
  loadImages();

  // Check if in wishlist
  updateWishlistButton();
}

// Load product images
function loadImages() {
  const mainImage = document.getElementById("mainImage");
  const thumbnailGallery = document.querySelector(".thumbnail-gallery");

  // Set main image
  mainImage.src = currentProduct.images[0];

  // Generate thumbnails
  thumbnailGallery.innerHTML = currentProduct.images
    .map(
      (img, index) => `
        <div class="thumbnail ${
          index === 0 ? "active" : ""
        }" data-image="${img}">
            <img src="${img}" alt="Thumbnail ${index + 1}">
        </div>
    `
    )
    .join("");

  // Add thumbnail click handlers
  document.querySelectorAll(".thumbnail").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const imageSrc = thumb.dataset.image;
      mainImage.src = imageSrc;

      document
        .querySelectorAll(".thumbnail")
        .forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
    });
  });
}

// Initialize event listeners
function initializeEventListeners() {
  // Size selection
  document.querySelectorAll(".size-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".size-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedSize = btn.dataset.size;
    });
  });

  // Color selection
  document.querySelectorAll(".color-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".color-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedColor = btn.dataset.color;
    });
  });

  // Quantity controls
  document.getElementById("decreaseQty").addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      document.getElementById("quantity").value = quantity;
    }
  });

  document.getElementById("increaseQty").addEventListener("click", () => {
    if (quantity < 10) {
      quantity++;
      document.getElementById("quantity").value = quantity;
    }
  });

  // Add to cart
  document.getElementById("addToCartBtn").addEventListener("click", addToCart);

  // Wishlist
  document
    .getElementById("wishlistBtn")
    .addEventListener("click", toggleWishlist);

  // Tabs
  initializeTabs();
}

// Add to cart
function addToCart() {
  const productToAdd = {
    id: parseInt(Utils.getUrlParameter("id") || "1"),
    name: currentProduct.name,
    price: currentProduct.price,
    image: currentProduct.images[0],
    quantity: quantity,
    size: selectedSize,
    color: selectedColor,
  };

  CartManager.addToCart(productToAdd);
  Utils.showNotification(
    `${quantity} ${currentProduct.name}(s) added to cart!`
  );
  Utils.animateAddToCart(document.getElementById("addToCartBtn"));
}

// Toggle wishlist
function toggleWishlist() {
  const product = {
    id: parseInt(Utils.getUrlParameter("id") || "1"),
    name: currentProduct.name,
    price: currentProduct.price,
    image: currentProduct.images[0],
    rating: currentProduct.rating,
  };

  const added = CartManager.toggleWishlist(product);
  updateWishlistButton();

  if (added) {
    Utils.showNotification(`${product.name} added to wishlist!`);
  } else {
    Utils.showNotification(`${product.name} removed from wishlist!`);
  }
}

// Update wishlist button
function updateWishlistButton() {
  const btn = document.getElementById("wishlistBtn");
  const icon = btn.querySelector("i");
  const productId = parseInt(Utils.getUrlParameter("id") || "1");

  if (CartManager.isInWishlist(productId)) {
    icon.classList.remove("far");
    icon.classList.add("fas");
    btn.classList.add("active");
  } else {
    icon.classList.remove("fas");
    icon.classList.add("far");
    btn.classList.remove("active");
  }
}

// Initialize tabs
function initializeTabs() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab;

      // Update buttons
      document
        .querySelectorAll(".tab-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Update panels
      document
        .querySelectorAll(".tab-panel")
        .forEach((panel) => panel.classList.remove("active"));
      document.getElementById(tabId).classList.add("active");
    });
  });
}

// Load related products
function loadRelatedProducts() {
  const grid = document.getElementById("relatedProducts");
  grid.innerHTML = relatedProducts
    .map((product) => Utils.generateProductCard(product))
    .join("");

  // Add event listeners
  initializeRelatedProductButtons();
}

// Initialize related product buttons
function initializeRelatedProductButtons() {
  document.querySelectorAll("#relatedProducts .add-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const productId = parseInt(e.currentTarget.dataset.id);
      const product = relatedProducts.find((p) => p.id === productId);

      if (product) {
        CartManager.addToCart(product);
        Utils.showNotification(`${product.name} added to cart!`);
        Utils.animateAddToCart(e.currentTarget);
      }
    });
  });

  document.querySelectorAll("#relatedProducts .love").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const productId = parseInt(e.currentTarget.dataset.id);
      const product = relatedProducts.find((p) => p.id === productId);

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
