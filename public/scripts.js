console.log("🔥 script.js loaded");

// ✅ Password validation
function validatePasswords() {
  const password = document.getElementById("password")?.value;
  const confirmPassword = document.getElementById("confirm_password")?.value;
  const errorText = document.getElementById("error");

  if (password !== confirmPassword) {
    errorText.textContent = "❌ Passwords do not match!";
    return false;
  }

  errorText.textContent = "";
  return true;
}

// ✅ Navigation functions
function openSignupPage() {
  window.location.href = "signup.html";
}
function openSigninPage() {
  window.location.href = "signin.html";
}
function openWaitlist() {
  window.location.href = "waitlist.html";
}

// ✅ Form handlers
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("bdy");
  const signinForm = document.getElementById("signinForm");

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validatePasswords()) return;

      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        address: document.getElementById("address").value,
        preferences: document.getElementById("preferences").value,
      };

      try {
        const response = await fetch("https://arc-tf9r.onrender.com/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
          alert(result.msg || "Signed up successfully!");
          window.location.href = "signin.html";
        } else {
          document.getElementById("error").textContent = result.msg;
        }
      } catch (error) {
        document.getElementById("error").textContent = "Error signing up";
      }
    });
  }

  if (signinForm) {
    signinForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const messageSpan = document.getElementById("signin-message");
      messageSpan.textContent = "🔄 Signing in...";
      messageSpan.style.color = "blue";
  
      const formData = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
      };
  
      try {
        const response = await fetch("https://arc-tf9r.onrender.com/api/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
  
        const result = await response.json();
  
        console.log("🔍 Response:", result);
        console.log("📦 Status:", response.status);
  
        // ✅ Show message (from either msg or message)
        const message = result.msg || result.message || "Unknown response";
  
        if (response.status === 200) {
            // Save user ID to localStorage
            localStorage.setItem("userId", result.user.id);

            // Optional: you can also save name/email/etc.
            localStorage.setItem("userEmail", result.user.email);
            localStorage.setItem("userName", result.user.name);
          messageSpan.textContent = message;
          messageSpan.style.color = "green";
          setTimeout(() => {
            window.location.href = "dashboard.html"; // or dashboard.html
          }, 1200);
        } else {
          messageSpan.textContent = message;
          messageSpan.style.color = "red";
        }
      } catch (error) {
        console.error("🚨 SIGNIN ERROR:", error);
        messageSpan.textContent = "❌ Server error. Please try again.";
        messageSpan.style.color = "red";
      }
    });
  }

  // ✅ Product/cart logic (runs only on index.html)
  const products = {
    "arc-pro": {
      name: "ARC Pro",
      image: "assets/arcpro.jpeg",
      description:
        "Our flagship model with advanced purification technology for large spaces. Designed for homes and offices up to 1,200 sq.ft.",
      price: "₹40,999",
      originalPrice: "₹41,499",
      features: [
        { icon: "fas fa-sync-alt", text: "360° Purification" },
        { icon: "fas fa-shield-alt", text: "HEPA-13 Filter" },
        { icon: "fas fa-lightbulb", text: "Smart Sensing" },
        { icon: "fas fa-mobile-alt", text: "App Control" },
      ],
    },
    "arc-air": {
      name: "ARC Air",
      image: "assets/arcair.jpeg",
      description:
        "A versatile model for medium-sized rooms, offering powerful purification up to 800 sq.ft.",
      price: "₹28,999",
      originalPrice: "₹29,499",
      features: [
        { icon: "fas fa-sync-alt", text: "360° Purification" },
        { icon: "fas fa-shield-alt", text: "HEPA-12 Filter" },
        { icon: "fas fa-lightbulb", text: "Standard Sensing" },
        { icon: "fas fa-mobile-alt", text: "App Control" },
      ],
    },
    "arc-mini": {
      name: "ARC Mini",
      image: "assets/arcmini.jpeg",
      description:
        "Compact and efficient, perfect for small spaces up to 400 sq.ft.",
      price: "₹16,499",
      originalPrice: "₹16,999",
      features: [
        { icon: "fas fa-sync-alt", text: "360° Purification" },
        { icon: "fas fa-shield-alt", text: "HEPA-11 Filter" },
        { icon: "fas fa-lightbulb", text: "Basic Sensing" },
        { icon: "fas fa-times", text: "No App Control" },
      ],
    },
  };

  let cart = [];

  const cartBtn = document.getElementById("cart-btn");
  const cartDropdown = document.getElementById("cart-dropdown");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const emptyCartMessage = document.getElementById("empty-cart");
  const checkoutBtn = document.getElementById("checkout-btn");

  if (cartBtn && cartDropdown) {
    cartBtn.addEventListener("click", () => {
      cartDropdown.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (!cartBtn.contains(e.target) && !cartDropdown.contains(e.target)) {
        cartDropdown.classList.remove("active");
      }
    });
  }

  function updateCart() {
    if (!cartItemsContainer || !cartCount || !emptyCartMessage || !checkoutBtn) return;

    cartItemsContainer.innerHTML = "";
    if (cart.length === 0) {
      emptyCartMessage.style.display = "block";
      checkoutBtn.disabled = true;
    } else {
      emptyCartMessage.style.display = "none";
      checkoutBtn.disabled = false;
      cart.forEach((item, index) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-price">${item.price}</span>
          <button class="cart-item-remove" data-index="${index}">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItem);
      });
    }
    cartCount.textContent = cart.length;
  }

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("buy-btn")) {
      const model = e.target.dataset.model;
      const product = products[model];
      cart.push({ name: product.name, price: product.price });
      updateCart();
    }
  });

  if (cartItemsContainer) {
    cartItemsContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("cart-item-remove")) {
        const index = e.target.dataset.index;
        cart.splice(index, 1);
        updateCart();
      }
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length > 0) {
        alert("Proceeding to checkout with " + cart.length + " items!");
        cart = [];
        updateCart();
      }
    });
  }

  // Smooth scrolling
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const headerHeight = 80;
        const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: "smooth" });
      }
    });
  });

  // Initialize cart on page load
  updateCart();
});
