/**
 * Cart Manager - Central cart and wishlist management system
 * Uses localStorage for data persistence
 */

const CartManager = {
  // Storage keys
  CART_KEY: "chairs_shop_cart",
  WISHLIST_KEY: "chairs_shop_wishlist",

  // Get cart items
  getCart() {
    try {
      const cart = localStorage.getItem(this.CART_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch (e) {
      console.error("Error loading cart:", e);
      return [];
    }
  },

  // Save cart
  saveCart(cart) {
    try {
      localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
      this.updateCartCount();
      return true;
    } catch (e) {
      console.error("Error saving cart:", e);
      return false;
    }
  },

  // Add item to cart
  addToCart(product) {
    const cart = this.getCart();
    const existingItem = cart.find(
      (item) =>
        item.id === product.id &&
        item.size === product.size &&
        item.color === product.color
    );

    if (existingItem) {
      existingItem.quantity += product.quantity || 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: product.quantity || 1,
        size: product.size || "Standard",
        color: product.color || "Default",
      });
    }

    this.saveCart(cart);
    return true;
  },

  // Update cart item quantity
  updateQuantity(itemId, size, color, newQuantity) {
    const cart = this.getCart();
    const item = cart.find(
      (item) => item.id === itemId && item.size === size && item.color === color
    );

    if (item) {
      if (newQuantity <= 0) {
        return this.removeFromCart(itemId, size, color);
      }
      item.quantity = newQuantity;
      this.saveCart(cart);
      return true;
    }
    return false;
  },

  // Remove item from cart
  removeFromCart(itemId, size, color) {
    let cart = this.getCart();
    const initialLength = cart.length;

    cart = cart.filter(
      (item) =>
        !(
          Number(item.id) === Number(itemId) &&
          String(item.size).trim() === String(size).trim() &&
          String(item.color).trim() === String(color).trim()
        )
    );

    if (cart.length !== initialLength) {
      this.saveCart(cart);
      return true;
    }
    return false;
  },

  // Clear cart
  clearCart() {
    localStorage.removeItem(this.CART_KEY);
    this.updateCartCount();
  },

  // Get cart total
  getCartTotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  // Get cart count
  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },

  // Update cart count in header
  updateCartCount() {
    const cartIcon = document.querySelector(".fa-cart-shopping");
    if (cartIcon) {
      cartIcon.setAttribute("data-items", this.getCartCount());
    }
  },

  // Wishlist methods
  getWishlist() {
    try {
      const wishlist = localStorage.getItem(this.WISHLIST_KEY);
      return wishlist ? JSON.parse(wishlist) : [];
    } catch (e) {
      console.error("Error loading wishlist:", e);
      return [];
    }
  },

  saveWishlist(wishlist) {
    try {
      localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(wishlist));
      return true;
    } catch (e) {
      console.error("Error saving wishlist:", e);
      return false;
    }
  },

  // Add to wishlist
  addToWishlist(product) {
    const wishlist = this.getWishlist();
    const exists = wishlist.find((item) => item.id === product.id);

    if (!exists) {
      wishlist.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        rating: product.rating || 0,
      });
      this.saveWishlist(wishlist);
      return true;
    }
    return false;
  },

  // Remove from wishlist
  removeFromWishlist(productId) {
    let wishlist = this.getWishlist();
    wishlist = wishlist.filter((item) => Number(item.id) !== Number(productId));
    this.saveWishlist(wishlist);
    return true;
  },

  // Check if item is in wishlist
  isInWishlist(productId) {
    const wishlist = this.getWishlist();
    return wishlist.some((item) => Number(item.id) === Number(productId));
  },

  // Clear entire wishlist
  clearWishlist() {
    localStorage.setItem(this.WISHLIST_KEY, JSON.stringify([]));
    return true;
  },

  // Toggle wishlist
  toggleWishlist(product) {
    if (this.isInWishlist(product.id)) {
      this.removeFromWishlist(product.id);
      return false;
    } else {
      this.addToWishlist(product);
      return true;
    }
  },
};

// Initialize cart count on page load
document.addEventListener("DOMContentLoaded", () => {
  CartManager.updateCartCount();
});
