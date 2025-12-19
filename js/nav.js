/**
 * Navigation JavaScript
 */

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  handleMobileMenu();
  updateUserIcon();
  initializeMegaMenu();
});

// Update cart count in header
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("chairshop_cart") || "[]");
  const cartIcon = document.querySelector(".fa-cart-shopping");

  if (cartIcon) {
    const totalItems = cart.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );
    cartIcon.setAttribute("data-items", totalItems);
  }
}

// Handle mobile menu toggle
function handleMobileMenu() {
  const menuToggle = document.querySelector(".fa-bars");
  const navLinks = document.querySelector(".list-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }
}

// Initialize Mega Menu Toggle
function initializeMegaMenu() {
  const megaMenuParent = document.querySelector(".has-mega-menu");

  if (!megaMenuParent) return;

  const megaMenuLink = megaMenuParent.querySelector("a");

  // Toggle mega menu on click
  megaMenuLink.addEventListener("click", (e) => {
    // Don't navigate if clicking the arrow area
    if (
      e.target.classList.contains("mega-menu-arrow") ||
      e.target.closest(".mega-menu-arrow")
    ) {
      e.preventDefault();
      megaMenuParent.classList.toggle("active");
    } else {
      // Allow navigation to store.html when clicking the text
      // Close mega menu on link click
      megaMenuParent.classList.remove("active");
    }
  });

  // Close mega menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!megaMenuParent.contains(e.target)) {
      megaMenuParent.classList.remove("active");
    }
  });

  // Prevent closing when clicking inside mega menu
  const megaMenu = megaMenuParent.querySelector(".mega-menu");
  if (megaMenu) {
    megaMenu.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }
}

// Update user icon based on authentication state
function updateUserIcon() {
  const userIconLink = document.getElementById("userIcon");
  if (!userIconLink) return;

  // Check if user is logged in
  const session = localStorage.getItem("chairshop_session");
  const isLoggedIn = session !== null;

  if (isLoggedIn) {
    // User is logged in - create dropdown for profile
    const user = JSON.parse(session); // Parse user data
    // Logged in:
    // 1. Change icon to indicate logged in state/profile
    userIconLink.innerHTML = '<i class="fa-solid fa-user-check"></i>';
    userIconLink.title = `My Profile (${user.name})`;

    // 2. Redirect to profile page on click
    userIconLink.onclick = (e) => {
      e.preventDefault();
      window.location.href = "profile.html";
    };
  } else {
    // User is not logged in - link to login page
    userIconLink.href = "login.html";
    userIconLink.title = "Sign In";
  }
}

// Show user menu (Profile / Logout)
function showUserMenu() {
  const session = JSON.parse(localStorage.getItem("chairshop_session"));
  const userName = session?.name || "User";

  // Simple dropdown menu
  const confirmed = confirm(
    `Hello ${userName}!\n\nClick OK to Logout\nClick Cancel to stay logged in`
  );

  if (confirmed) {
    // Logout
    localStorage.removeItem("chairshop_session");
    if (typeof Utils !== "undefined" && Utils.showNotification) {
      Utils.showNotification("Logged out successfully");
    }
    setTimeout(() => {
      window.location.href = "index.html";
    }, 500);
  }
}

// Make updateCartCount available globally
if (typeof window !== "undefined") {
  window.updateCartCount = updateCartCount;
}
