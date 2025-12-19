/**
 * Home Page JavaScript - Product Buttons and Shuffle Filter
 */

document.addEventListener("DOMContentLoaded", () => {
  initializeShuffleFilter();
  initializeProductButtons();
});

// Initialize shuffle filter
function initializeShuffleFilter() {
  const shuffleButtons = document.querySelectorAll(".shuffle ul li");
  const productCards = document.querySelectorAll("#featuredProductsGrid .prod");

  // Add "All" as active by default
  if (shuffleButtons.length > 0) {
    shuffleButtons[0].classList.add("active");
  }

  shuffleButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      shuffleButtons.forEach((b) => b.classList.remove("active"));
      // Add active to clicked button
      btn.classList.add("active");

      // Get category from button text
      const category = btn.textContent.trim().toLowerCase().replace(" ", "");

      // Filter products
      filterProducts(category, productCards);
    });
  });
}

// Filter products based on category
function filterProducts(category, productCards) {
  productCards.forEach((card) => {
    const cardCategory = card.dataset.category;

    // Show all products if "All" or matching category
    if (
      category === "all" ||
      category === "wodenchair" ||
      category === "plasticchair" ||
      category === "studytable" ||
      category === "armoires"
    ) {
      // Map button text to data-category values
      const categoryMap = {
        wodenchair: "wooden",
        woodenchair: "wooden",
        plasticchair: "plastic",
        studytable: "study",
        armoires: "armoire",
      };

      const mappedCategory = categoryMap[category] || category;

      if (category === "all" || cardCategory === mappedCategory) {
        card.style.display = "block";
        card.style.animation = "fadeIn 0.5s ease";
      } else {
        card.style.display = "none";
      }
    }
  });
}

// Initialize product buttons (wishlist, add to cart)
function initializeProductButtons() {
  const container = document.querySelector("#featuredProductsGrid");
  if (!container) return;

  // Add to wishlist
  container.querySelectorAll(".love").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const productId = parseInt(btn.dataset.id);
      const card = btn.closest(".prod");

      if (card) {
        const product = {
          id: productId,
          name: card.querySelector(".name").textContent,
          price: parseFloat(
            card.querySelector(".price").textContent.replace("$", "")
          ),
          image: card.querySelector("img").src,
          rating: 5,
        };

        if (CartManager.toggleWishlist(product)) {
          btn.querySelector("i").classList.remove("far");
          btn.querySelector("i").classList.add("fas");
          Utils.showNotification("Added to wishlist");
        } else {
          btn.querySelector("i").classList.remove("fas");
          btn.querySelector("i").classList.add("far");
          Utils.showNotification("Removed from wishlist");
        }
      }
    });
  });

  // Add to cart
  container.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const productId = parseInt(btn.dataset.id);
      const card = btn.closest(".prod");

      if (card) {
        const product = {
          id: productId,
          name: card.querySelector(".name").textContent,
          price: parseFloat(
            card.querySelector(".price").textContent.replace("$", "")
          ),
          image: card.querySelector("img").src,
          size: "Standard",
          color: "Default",
        };

        CartManager.addToCart(product);
        Utils.animateAddToCart(btn);
        Utils.showNotification("Added to cart");
        CartManager.updateCartCount();
      }
    });
  });
}

// Add CSS for fade animation
const style = document.createElement("style");
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .shuffle ul li {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .shuffle ul li.active {
        color: #7b5244;
        font-weight: bold;
    }
    
    .shuffle ul li:hover {
        color: #7b5244;
    }
`;
document.head.appendChild(style);
