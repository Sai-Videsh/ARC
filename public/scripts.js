// ✅ Air bubble animation
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function createAirBubbles() {
  const container = document.getElementById("air-visualization");
  const bubbleCount = 15;
  for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement("div");
    bubble.classList.add("air-bubble");
    const size = Math.floor(Math.random() * 80) + 20;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.setProperty("--x-offset", Math.random() * 0.4 - 0.2);
    const duration = Math.floor(Math.random() * 15) + 10;
    bubble.style.animationDuration = `${duration}s`;
    bubble.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(bubble);
  }
}

// ✅ Theme toggle functionality
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  const themeIcon = themeToggle.querySelector("i");
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    if (document.body.classList.contains("dark-theme")) {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
      localStorage.setItem("theme", "dark");
    } else {
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
      localStorage.setItem("theme", "light");
    }
  });
}

// ✅ Password visibility toggle
const passwordToggles = document.querySelectorAll(".password-toggle");
passwordToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const targetId = toggle.getAttribute("data-target");
    const input = document.getElementById(targetId);
    const type = input.getAttribute("type") === "password" ? "text" : "password";
    input.setAttribute("type", type);
    toggle.innerHTML =
      type === "password"
        ? '<i class="fas fa-eye"></i>'
        : '<i class="fas fa-eye-slash"></i>';
  });
});

// ✅ OTP validation
function validateOTP(otp) {
  return /^\d{6}$/.test(otp);
}

// ✅ Password validation (used in signup)
function validatePasswords() {
  const password = document.getElementById("password")?.value;
  const confirmPassword = document.getElementById("confirmPassword")?.value;
  const errorText = document.getElementById("error");
  if (password !== confirmPassword) {
    errorText.textContent = "❌ Passwords do not match!";
    return false;
  }
  errorText.textContent = "";
  return true;
}

// ✅ Navigation helper
function openSignupPage() {
  window.location.href = "signup.html";
}
function openSigninPage() {
  window.location.href = "signin.html";
}

// ✅ Social Login Handlers (Google + Facebook)
document.getElementById("googleLoginBtn")?.addEventListener("click", () => {
  window.location.href = "${API_URL}/auth/google"; // Redirect to Google OAuth
});

document.getElementById("facebookLoginBtn")?.addEventListener("click", () => { // ✅ NEW: Facebook Login handler
  window.location.href = "${API_URL}/auth/facebook"; // Redirect to Facebook OAuth
});

document.getElementById("appleLoginBtn")?.addEventListener("click", () => { // ✅ NEW: Apple Login handler
  alert("This feature will be coming soon..."); // Display alert for Apple Login
});

// ✅ OTP Page Handler (otp.html)
document.getElementById("otpForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const otp = document.getElementById("otp").value;
  const messageEl = document.getElementById("otp-message");
  const submitBtn = document.querySelector(".submit-btn");
  const loadingOverlay = document.getElementById("loadingOverlay");

  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email");

  if (!email) {
    alert("Email is missing from URL. Redirecting...");
    window.location.href = "signup.html";
    return;
  }

  if (!validateOTP(otp)) {
    messageEl.textContent = "OTP must be a 6-digit number";
    return;
  }

  submitBtn.classList.add("loading");
  loadingOverlay?.classList.add("active");
  messageEl.textContent = "Verifying OTP...";

  try {
    const res = await fetch("${API_URL}/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (res.ok) {
      messageEl.textContent = "OTP verified! Redirecting...";
      messageEl.style.color = "#4caf50";
      setTimeout(() => {
        window.location.href = "signin.html";
      }, 1500);
    } else {
      messageEl.textContent = data.message || "Invalid OTP";
      messageEl.style.color = "red";
    }
  } catch (err) {
    console.error("❌ OTP error:", err);
    messageEl.textContent = "Server error. Try again later.";
  } finally {
    submitBtn.classList.remove("loading");
    loadingOverlay?.classList.remove("active");
  }
});

function startResendOtpTimer(duration = 60) {
  const resendBtn = document.getElementById('resendOtp');
  let countdown = duration;

  resendBtn.disabled = true;
  resendBtn.textContent = `Resend OTP in ${countdown}s`;

  const interval = setInterval(() => {
    countdown--;
    resendBtn.textContent = `Resend OTP in ${countdown}s`;

    if (countdown <= 0) {
      clearInterval(interval);
      resendBtn.disabled = false;
      resendBtn.textContent = "Resend OTP";
    }
  }, 1000);
}

// ✅ Resend OTP Button Click
document.getElementById('resendOtp')?.addEventListener('click', async function (e) {
  e.preventDefault();

  const resendBtn = document.getElementById('resendOtp');
  const messageEl = document.getElementById('otp-message');
  const email = new URLSearchParams(window.location.search).get('email');

  // Prevent clicking when disabled
  if (resendBtn.disabled) return;

  if (!email) {
    messageEl.textContent = "❌ Email missing. Cannot resend OTP.";
    return;
  }

  // Show immediate feedback
  messageEl.textContent = "Resending OTP...";
  messageEl.style.color = "#888";

  try {
    const res = await fetch("${API_URL}/api/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const result = await res.json();

    if (res.ok) {
      messageEl.textContent = "✅ OTP resent successfully!";
      messageEl.style.color = "#4caf50";
    } else {
      messageEl.textContent = result.message || "Failed to resend OTP";
      messageEl.style.color = "red";
    }
  } catch (err) {
    messageEl.textContent = "❌ Server error while resending OTP";
    messageEl.style.color = "red";
  }
});

// ✅ DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("load", createAirBubbles);

  // ✅ Tab switching functionality for Choose Your ARC section
  const tabButtons = document.querySelectorAll('.tab-btn');
  const productDetails = document.getElementById('product-details');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all tabs
      tabButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked tab
      button.classList.add('active');
      
      const model = button.getAttribute('data-model');
      updateProductDetails(model);
    });
  });

  // Function to update product details based on selected model
  function updateProductDetails(model) {
    const productInfo = productDetails.querySelector('.product-info');
    const productImage = productDetails.querySelector('.product-image img');
    
    switch(model) {
      case 'arc-pro':
        productImage.src = 'assets/arcpro.jpeg';
        productImage.alt = 'ARC Pro';
        productInfo.innerHTML = `
          <h3>ARC Pro</h3>
          <p>Our flagship model with advanced purification technology for large spaces. Designed for homes and offices up to 1,200 sq.ft.</p>
          <div class="price"><del>₹41,499</del> ₹40,999</div>
          <div class="features">
            <div class="feature"><i class="fas fa-sync-alt"></i> 360° Purification</div>
            <div class="feature"><i class="fas fa-shield-alt"></i> HEPA-13 Filter</div>
            <div class="feature"><i class="fas fa-lightbulb"></i> Smart Sensing</div>
            <div class="feature"><i class="fas fa-mobile-alt"></i> App Control</div>
          </div>
          <div class="action-buttons">
            <button class="buy-btn" data-model="arc-pro" onclick="openSignupPage()">Buy Now</button>
            <button class="learn-btn">Learn More</button>
          </div>
        `;
        break;
      case 'arc-air':
        productImage.src = 'assets/arcair.jpeg';
        productImage.alt = 'ARC Air';
        productInfo.innerHTML = `
          <h3>ARC Air</h3>
          <p>Perfect balance of performance and value for medium-sized spaces. Ideal for apartments and small offices up to 800 sq.ft.</p>
          <div class="price"><del>₹29,999</del> ₹28,999</div>
          <div class="features">
            <div class="feature"><i class="fas fa-sync-alt"></i> 360° Purification</div>
            <div class="feature"><i class="fas fa-shield-alt"></i> HEPA-12 Filter</div>
            <div class="feature"><i class="fas fa-lightbulb"></i> Smart Sensing</div>
            <div class="feature"><i class="fas fa-mobile-alt"></i> App Control</div>
          </div>
          <div class="action-buttons">
            <button class="buy-btn" data-model="arc-air" onclick="openSignupPage()">Buy Now</button>
            <button class="learn-btn">Learn More</button>
          </div>
        `;
        break;
      case 'arc-mini':
        productImage.src = 'assets/arcmini.jpeg';
        productImage.alt = 'ARC Mini';
        productInfo.innerHTML = `
          <h3>ARC Mini</h3>
          <p>Compact and portable air purifier for small spaces. Perfect for bedrooms, study rooms, and personal spaces up to 400 sq.ft.</p>
          <div class="price"><del>₹16,999</del> ₹16,499</div>
          <div class="features">
            <div class="feature"><i class="fas fa-sync-alt"></i> 360° Purification</div>
            <div class="feature"><i class="fas fa-shield-alt"></i> HEPA-11 Filter</div>
            <div class="feature"><i class="fas fa-lightbulb"></i> Basic Sensing</div>
            <div class="feature"><i class="fas fa-mobile-alt"></i> Manual Control</div>
          </div>
          <div class="action-buttons">
            <button class="buy-btn" data-model="arc-mini" onclick="openSignupPage()">Buy Now</button>
            <button class="learn-btn">Learn More</button>
          </div>
        `;
        break;
    }
  }

  const signupForm = document.getElementById("signupForm");
  const signinForm = document.getElementById("signinForm");
  const signinContainer = document.getElementById("signinContainer");
   const verifyBtn = document.getElementById("verifyHumanBtn");
  const verifyMessage = document.getElementById("verify-message");
  const verifyHuman = document.getElementById("verifyHuman");
  const loadingOverlay = document.getElementById("loadingOverlay");
  let pageLoadTime = Date.now();
  let mouseMovements = 0;

  // Track mouse movement with debugging
  document.addEventListener("mousemove", () => {
    if (mouseMovements < 10) {
      mouseMovements++;
      console.log("Mouse movement detected, count:", mouseMovements); // ✅ Debug log
    }
  });

  if (verifyBtn) {
    verifyBtn.addEventListener("click", async () => {
      const clickTime = Date.now();
      const delay = (clickTime - pageLoadTime) / 1000; // Delay in seconds
      const userAgent = navigator.userAgent || "Unknown Agent"; // ✅ Fallback if undefined
      console.log("User-Agent before fetch:", userAgent); // ✅ Debug log
      console.log("Verification attempt - Delay:", delay, "Mouse Movements:", mouseMovements, "User-Agent:", userAgent); // ✅ Debug log

      verifyMessage.textContent = "Verifying... ✨";
      verifyBtn.classList.add("loading");
      loadingOverlay?.classList.add("active");
      verifyHuman.style.display = "block"; // ✅ Ensure visible during verification
      signinContainer.style.display = "none"; // ✅ Ensure hidden during verification


      try {
        const res = await fetch("${API_URL}/api/verify-human", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ delay }),
        });

        const data = await res.json();
        if (res.ok) {
          verifyMessage.textContent = "✅ You’re human! Login unlocked. 🌟";
          verifyMessage.style.color = "#4caf50";
          localStorage.setItem("humanVerified", "true"); // Store verification
          const randomDelay = 3000 + Math.floor(Math.random() * 2001); // 3000-5000 ms
          console.log("Delaying redirect for:", randomDelay, "ms");
          await new Promise(resolve => setTimeout(resolve, randomDelay))
          verifyHuman.style.display = "none";
          signinContainer.style.display = "block";
          // setTimeout(() => {
          //   loadingOverlay?.classList.remove("active");
          //   window.location.href = "signin.html"; // Redirect to signin page
          // }, 5000);
        } else {
          verifyMessage.textContent = data.message || "Verification failed. Try again.";
          verifyMessage.style.color = "red";
          signinContainer.style.display = "none"; // ✅ Keep login form hidden on failure
          loadingOverlay?.classList.remove("active");
        }
      } catch (err) {
        verifyMessage.textContent = "❌ Server error. Try again later.";
        verifyMessage.style.color = "red";
        signinContainer.style.display = "none"; // ✅ Keep login form hidden on error
        console.error("Fetch error:", err); // ✅ Debug log
        loadingOverlay?.classList.remove("active");
      } finally {
        verifyBtn.classList.remove("loading");
        loadingOverlay?.classList.remove("active");
      }
    });
  }

  // ✅ Signup form submit
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fullName = document.getElementById("fullName").value;
      const phone = document.getElementById("phone").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const address = document.getElementById("address").value;
      const messageEl = document.getElementById("signup-message");
      const submitBtn = document.querySelector(".submit-btn");
      const loadingOverlay = document.getElementById("loadingOverlay");

      if (!fullName || !phone || !email || !password || !confirmPassword || !address) {
        messageEl.textContent = "Please fill in all fields";
        return;
      }
      if (fullName.length < 2) {
        messageEl.textContent = "Full name must be at least 2 characters";
        return;
      }
      if (!/^\+?\d{10,15}$/.test(phone)) {
        messageEl.textContent = "Invalid phone number";
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        messageEl.textContent = "Invalid email address";
        return;
      }
      if (password.length < 6) {
        messageEl.textContent = "Password too short";
        return;
      }
      if (password !== confirmPassword) {
        messageEl.textContent = "Passwords do not match";
        return;
      }
      if (address.length < 10) {
        messageEl.textContent = "Invalid address";
        return;
      }

      messageEl.textContent = "Creating account...";
      submitBtn.classList.add("loading");
      loadingOverlay?.classList.add("active");

      const formData = {
        name: fullName,
        phone,
        email,
        password,
        address,
      };

      try {
        const response = await fetch("${API_URL}/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
          messageEl.textContent = "Account created! Redirecting...";
          setTimeout(() => {
            window.location.href = `otp.html?email=${encodeURIComponent(email)}`;
          }, 1500);
        } else {
          messageEl.textContent = result.message || "Signup failed";
        }
      } catch (error) {
        messageEl.textContent = "Error signing up. Try again.";
      } finally {
        loadingOverlay?.classList.remove("active");
        submitBtn?.classList.remove("loading");
      }
    });
  }

  // ✅ Signin form submit
  if (signinForm) {
    console.log("signinForm found, initializing forgot password logic");
    signinForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const messageEl = document.getElementById("signin-message");
      const submitBtn = document.querySelector(".submit-btn");
      const loadingOverlay = document.getElementById("loadingOverlay");

      if (!email || !password) {
        messageEl.textContent = "Please fill in all fields";
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        messageEl.textContent = "Invalid email";
        return;
      }
      if (password.length < 6) {
        messageEl.textContent = "Password too short";
        return;
      }

      submitBtn.classList.add("loading");
      messageEl.textContent = "Authenticating...";
      loadingOverlay.classList.add("active");

      try {
        const response = await fetch("${API_URL}/api/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const result = await response.json();
        if (response.status === 200) {
          messageEl.textContent = "Login successful! Redirecting...";
          messageEl.style.color = "#66BB6A"; // ✅ you forgot `.style`
          localStorage.setItem("userId", result.user.id);
          // localStorage.setItem("userEmail", result.user.email);
          // localStorage.setItem("userName", result.user.name);
            localStorage.setItem("profileData", JSON.stringify(result.user));

          setTimeout(() => {
            window.location.href = "dashboard1.html";
          }, 1200);
        } else {
          messageEl.textContent = result.message || "Login failed";
        }
      } catch (err) {
        messageEl.textContent = "Server error. Try again.";
      } finally {
        submitBtn.classList.remove("loading");
        loadingOverlay.classList.remove("active");
      }
    });

    // Forgot Password Flow
    const forgotLink = document.getElementById("forgotPasswordLink");
    const forgotStep1 = document.getElementById("forgotStep1");
    const forgotStep2 = document.getElementById("forgotStep2");
    const forgotStep3 = document.getElementById("forgotStep3");

    const forgotEmailInput = document.getElementById("resetEmail");
    const otpInput = document.getElementById("resetOtp");
    const newPassInput = document.getElementById("newPassword");
    const confirmPassInput = document.getElementById("confirmNewPassword");

    const forgotMsg1 = document.getElementById("forgot-message1");
    const forgotMsg2 = document.getElementById("forgot-message2");
    const forgotMsg3 = document.getElementById("forgot-message3");

    const sendOtpBtn = document.getElementById("sendOtpBtn");
    const verifyOtpBtn = document.getElementById("verifyOtpBtn");
    const resetPasswordBtn = document.getElementById("resetPasswordBtn");

      console.log("Forgot Password DOMs", forgotLink, forgotStep1);
     
// etc.

    // ✅ Step 0: When "Forgot Password?" is clicked
    forgotLink?.addEventListener("click", (e) => {
      e.preventDefault();
//       document.getElementById("signinContainer").style.display = "none";
//       forgotStep1.style.display = "block";
//       forgotStep1.style.height = "auto"; // 👈 forces it to grow naturally
// forgotStep1.style.width = "100%"; 
signinForm.style.display = "none";
        forgotStep1.style.display = "block";
        console.log("Forgot password step 1 displayed");
    });

    // ✅ Step 1: Request OTP
    document.getElementById("sendOtpBtn")?.addEventListener("click", async function () {
      const email = document.getElementById("resetEmail").value.trim();
      const message1 = document.getElementById("forgot-message1");

      if (!email) {
        message1.textContent = "Please enter your email.";
        message1.style.color = "red";
        return;
      }

      // Show immediate feedback
      message1.textContent = "Sending OTP...";
      message1.style.color = "#888";

      try {
        const res = await fetch("${API_URL}/api/request-password-reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (res.ok) {
          message1.textContent = "✅ OTP sent to your email. Redirecting...";
          message1.style.color = "green";
          localStorage.setItem("resetEmail", email.trim().toLowerCase());
          
          setTimeout(() => {
            document.getElementById("forgotStep1").style.display = "none";
            document.getElementById("forgotStep2").style.display = "block";
            startOtpTimer();
          }, 1500);
        } else {
          message1.textContent = data.message || "Something went wrong.";
          message1.style.color = "red";
        }
      } catch (err) {
        message1.textContent = "❌ Server error.";
        message1.style.color = "red";
      }
    });

    // ✅ Step 2: Verify OTP
    verifyOtpBtn?.addEventListener("click", async () => {
      const otp = otpInput.value;
      const email = localStorage.getItem("resetEmail");

      if (!email) {
        forgotMsg2.textContent = "Email missing. Please start over.";
        forgotMsg2.style.color = "red";
        return;
      }

      if (!otp) {
        forgotMsg2.textContent = "Enter OTP to continue.";
        forgotMsg2.style.color = "red";
        return;
      }

      try {
        const res = await fetch("${API_URL}/api/verify-password-reset-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        });

        const result = await res.json();
        if (res.ok) {
          forgotMsg2.textContent = "OTP verified! Redirecting...";
          forgotMsg2.style.color = "green";
          setTimeout(() => {
            forgotStep2.style.display = "none";
            forgotStep3.style.display = "block";
          }, 1500);
        } else {
          forgotMsg2.textContent = result.message || "Invalid OTP";
          forgotMsg2.style.color = "red";
        }
      } catch (err) {
        forgotMsg2.textContent = "Server error.";
        forgotMsg2.style.color = "red";
      }
    });

    // ✅ Step 3: Reset Password
    resetPasswordBtn?.addEventListener("click", async () => {
      const newPassword = newPassInput.value;
      const confirmPassword = confirmPassInput.value;
      const email = localStorage.getItem("resetEmail");

      if (!email) {
        forgotMsg3.textContent = "Email missing. Please start over.";
        forgotMsg3.style.color = "red";
        return;
      }

      if (newPassword !== confirmPassword) {
        forgotMsg3.textContent = "Passwords do not match!";
        forgotMsg3.style.color = "red";
        return;
      }

      try {
        const res = await fetch("${API_URL}/api/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, newPassword }),
        });

        const result = await res.json();
        if (res.ok) {
          forgotMsg3.textContent = "Password updated! Redirecting...";
          forgotMsg3.style.color = "green";
          localStorage.removeItem("resetEmail");
          setTimeout(() => {
            window.location.href = "signin.html";
          }, 2000);
        } else {
          forgotMsg3.textContent = result.message || "Reset failed.";
          forgotMsg3.style.color = "red";
        }
      } catch (err) {
        forgotMsg3.textContent = "Server error. Try again.";
        forgotMsg3.style.color = "red";
      }
    });

    document.getElementById("resendOtpLink")?.addEventListener("click", async (e) => {
      e.preventDefault();

      const email = localStorage.getItem("resetEmail");
      const msg = document.getElementById("forgot-message2");

      if (!email) {
        msg.textContent = "Email missing. Please start over.";
        msg.style.color = "red";
        return;
      }

      msg.textContent = "Resending OTP...";
      msg.style.color = "#888";

      try {
        const res = await fetch("${API_URL}/api/request-password-reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (res.ok) {
          msg.textContent = "✅ OTP resent to your email.";
          msg.style.color = "green";
          startOtpTimer();
        } else {
          msg.textContent = data.message || "Failed to resend OTP.";
          msg.style.color = "red";
        }
      } catch (err) {
        msg.textContent = "❌ Server error while resending OTP.";
        msg.style.color = "red";
      }
    });

    
  }
});

function startOtpTimer() {
  const resendLink = document.getElementById("resendOtpLink");
  const timerText = document.getElementById("otp-timer-text");
  let countdown = 30;

  resendLink.classList.remove("enabled");
  resendLink.classList.add("disabled");
  resendLink.style.pointerEvents = "none";
  resendLink.style.opacity = "0.5";

  const timerInterval = setInterval(() => {
    countdown--;
    timerText.textContent = `Resend OTP in ${countdown}s`;

    if (countdown <= 0) {
      clearInterval(timerInterval);
      timerText.textContent = "";
      resendLink.style.pointerEvents = "auto";
      resendLink.style.opacity = "1";
      resendLink.classList.remove("disabled");
      resendLink.classList.add("enabled");
    }
  }, 1000);
}