/**
 * Authentication JavaScript - Login, Registration, and Session Management
 */

document.addEventListener("DOMContentLoaded", () => {
  initializeAuth();
});

function initializeAuth() {
  const currentPage = window.location.pathname;

  if (currentPage.includes("login.html")) {
    initializeLogin();
  } else if (currentPage.includes("register.html")) {
    initializeRegister();
  }
}

// ============ LOGIN PAGE ============
function initializeLogin() {
  const form = document.getElementById("loginForm");
  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");

  // Toggle password visibility
  if (togglePassword) {
    togglePassword.addEventListener("click", () => {
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;
      togglePassword.classList.toggle("fa-eye");
      togglePassword.classList.toggle("fa-eye-slash");
    });
  }

  // Handle form submission
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      validateLoginForm();
    });
  }
}

function validateLoginForm() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const rememberMe = document.getElementById("rememberMe").checked;

  // Clear previous errors
  clearFormErrors();

  let isValid = true;

  // Validate email
  if (!isValidEmail(email)) {
    showFieldError("email", "Please enter a valid email address");
    isValid = false;
  }

  // Validate password
  if (password.length === 0) {
    showFieldError("password", "Password is required");
    isValid = false;
  }

  if (!isValid) return;

  // Process login
  const users = JSON.parse(localStorage.getItem("chairshop_users") || "[]");
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    // Successful login
    const sessionData = {
      userId: user.id,
      email: user.email,
      name: user.name,
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem("chairshop_session", JSON.stringify(sessionData));

    if (rememberMe) {
      localStorage.setItem("chairshop_remember", email);
    }

    // Show success and redirect
    if (typeof Utils !== "undefined") {
      Utils.showNotification("Login successful! Welcome back", "success");
    }

    setTimeout(() => {
      window.location.href = "profile.html";
    }, 1000);
  } else {
    showFieldError("password", "Invalid email or password");
  }
}

// ============ REGISTRATION PAGE ============
function initializeRegister() {
  const form = document.getElementById("registerForm");
  const togglePassword = document.getElementById("togglePassword");
  const toggleConfirmPassword = document.getElementById(
    "toggleConfirmPassword"
  );
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  // Toggle password visibility
  if (togglePassword) {
    togglePassword.addEventListener("click", () => {
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;
      togglePassword.classList.toggle("fa-eye");
      togglePassword.classList.toggle("fa-eye-slash");
    });
  }

  if (toggleConfirmPassword) {
    toggleConfirmPassword.addEventListener("click", () => {
      const type =
        confirmPasswordInput.type === "password" ? "text" : "password";
      confirmPasswordInput.type = type;
      toggleConfirmPassword.classList.toggle("fa-eye");
      toggleConfirmPassword.classList.toggle("fa-eye-slash");
    });
  }

  // Password strength indicator
  if (passwordInput) {
    passwordInput.addEventListener("input", () => {
      updatePasswordStrength(passwordInput.value);
    });
  }

  // Handle form submission
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      validateRegisterForm();
    });
  }
}

function updatePasswordStrength(password) {
  const strengthBar = document.getElementById("strengthBar");
  const strengthText = document.getElementById("strengthText");

  if (!strengthBar || !strengthText) return;

  // Remove previous strength classes
  strengthBar.className = "strength-bar";

  if (password.length === 0) {
    strengthText.textContent = "";
    return;
  }

  let strength = 0;

  // Check length
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;

  // Check for numbers
  if (/\d/.test(password)) strength++;

  // Check for lowercase and uppercase
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;

  // Check for special characters
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

  // Update UI based on strength
  if (strength <= 2) {
    strengthBar.classList.add("strength-weak");
    strengthText.textContent = "Weak password";
    strengthText.style.color = "#e74c3c";
  } else if (strength <= 4) {
    strengthBar.classList.add("strength-medium");
    strengthText.textContent = "Medium password";
    strengthText.style.color = "#f39c12";
  } else {
    strengthBar.classList.add("strength-strong");
    strengthText.textContent = "Strong password";
    strengthText.style.color = "#27ae60";
  }
}

function validateRegisterForm() {
  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const terms = document.getElementById("terms").checked;

  // Clear previous errors
  clearFormErrors();

  let isValid = true;

  // Validate name
  if (name.length < 2) {
    showFieldError("fullName", "Please enter your full name");
    isValid = false;
  }

  // Validate email
  if (!isValidEmail(email)) {
    showFieldError("email", "Please enter a valid email address");
    isValid = false;
  }

  // Check if email already exists
  const users = JSON.parse(localStorage.getItem("chairshop_users") || "[]");
  if (users.some((u) => u.email === email)) {
    showFieldError("email", "Email already registered");
    isValid = false;
  }

  // Validate password
  if (password.length < 6) {
    showFieldError("password", "Password must be at least 6 characters");
    isValid = false;
  }

  // Validate confirm password
  if (password !== confirmPassword) {
    showFieldError("confirmPassword", "Passwords do not match");
    isValid = false;
  }

  // Validate terms
  if (!terms) {
    if (typeof Utils !== "undefined") {
      Utils.showNotification("Please accept the terms and conditions", "error");
    }
    isValid = false;
  }

  if (!isValid) return;

  // Create new user
  const newUser = {
    id: Date.now(),
    name: name,
    email: email,
    password: password, // Note: In production, NEVER store plain-text passwords!
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem("chairshop_users", JSON.stringify(users));

  // Auto-login
  const sessionData = {
    userId: newUser.id,
    email: newUser.email,
    name: newUser.name,
    loginTime: new Date().toISOString(),
  };

  localStorage.setItem("chairshop_session", JSON.stringify(sessionData));

  // Show success and redirect
  if (typeof Utils !== "undefined") {
    Utils.showNotification("Account created successfully! Welcome", "success");
  }

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
}

// ============ UTILITY FUNCTIONS ============
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  const formGroup = field.closest(".form-group");
  if (formGroup) {
    formGroup.classList.add("error");
    const errorMsg = formGroup.querySelector(".error-message");
    if (errorMsg) {
      errorMsg.textContent = message;
    }
  }
}

function clearFormErrors() {
  document.querySelectorAll(".form-group").forEach((group) => {
    group.classList.remove("error");
  });
}

function socialLogin(provider) {
  if (typeof Utils !== "undefined") {
    Utils.showNotification(`${provider} login will be available soon`, "info");
  } else {
    alert(`${provider} login will be available soon`);
  }
}

// ============ SESSION MANAGEMENT ============
function getCurrentUser() {
  const session = localStorage.getItem("chairshop_session");
  return session ? JSON.parse(session) : null;
}

function isUserLoggedIn() {
  return getCurrentUser() !== null;
}

function logout() {
  localStorage.removeItem("chairshop_session");
  window.location.href = "index.html";
}

// Export functions for use in other scripts
if (typeof window !== "undefined") {
  window.Auth = {
    getCurrentUser,
    isUserLoggedIn,
    logout,
    socialLogin,
  };
}
