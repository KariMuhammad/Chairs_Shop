/**
 * Profile Page Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const currentUser = Auth.getCurrentUser();

  if (!currentUser) {
    // Not logged in -> Redirect to login
    window.location.href = "login.html";
    return;
  }

  // Initialize Logout (Priority)
  initializeLogout();

  // Initialize Profile Data
  initializeProfile(currentUser);
  initializeTabs();
});

function initializeProfile(user) {
  // ... (rest of function)
}

// ...

function initializeLogout() {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      // Direct robust logout
      localStorage.removeItem("chairshop_session");
      // Optional: clear other user specific data if needed
      // localStorage.removeItem("chairshop_wishlist"); 
      
      window.location.href = "index.html";
    });
  }
}
  const sidebarEmail = document.getElementById("sidebarEmail");

  if (sidebarName) sidebarName.textContent = user.name || "User";
  if (sidebarEmail) sidebarEmail.textContent = user.email || "";

  // Dashboard Data
  const welcomeName = document.getElementById("welcomeName");
  if (welcomeName)
    welcomeName.textContent = user.name ? user.name.split(" ")[0] : "User";

  // Wishlist Count
  const wishlist = JSON.parse(
    localStorage.getItem("chairshop_wishlist") || "[]"
  );
  const wishlistStat = document.getElementById("wishlistStat");
  if (wishlistStat) wishlistStat.textContent = wishlist.length;

  // Profile Details
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const joinDate = document.getElementById("joinDate");

  if (profileName) profileName.value = user.name || "";
  if (profileEmail) profileEmail.value = user.email || "";

  if (joinDate && user.createdAt) {
    const date = new Date(user.createdAt);
    joinDate.value = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } else if (joinDate) {
    joinDate.value = "N/A";
  }
}

function initializeTabs() {
  const tabButtons = document.querySelectorAll(".profile-nav button[data-tab]");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTabId = btn.getAttribute("data-tab");

      // Remove active class from all buttons
      tabButtons.forEach((b) => b.classList.remove("active"));
      // Add active to clicked button
      btn.classList.add("active");

      // Hide all tab contents
      document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.remove("active");
      });

      // Show target content
      const targetContent = document.getElementById(targetTabId);
      if (targetContent) targetContent.classList.add("active");
    });
  });
}

function initializeLogout() {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Are you sure you want to log out?")) {
        Auth.logout();
      }
    });
  }
}
