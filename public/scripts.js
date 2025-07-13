// ✅ Air bubble animation
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

// ✅ Google Login
document.getElementById("googleLoginBtn")?.addEventListener("click", () => {
  window.location.href = "http://localhost:5000/auth/google"; // change if deployed
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
    const res = await fetch("http://localhost:5000/api/verify-otp", {
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

// ✅ Resend OTP Handler
// document.getElementById('resendOtp')?.addEventListener('click', async function (e) {
//   e.preventDefault();

//   const messageEl = document.getElementById('otp-message');
//   const resendBtn = document.getElementById('resendOtp');
//   const email = new URLSearchParams(window.location.search).get('email');

//   if (!email) {
//     messageEl.textContent = "No email found to resend OTP";
//     return;
//   }

//   // Disable button and start countdown
//   let countdown = 60;
//   resendBtn.disabled = true;
//   resendBtn.textContent = `Resend OTP in ${countdown}s`;
//   const timer = setInterval(() => {
//     countdown--;
//     resendBtn.textContent = `Resend OTP in ${countdown}s`;

//     if (countdown <= 0) {
//       clearInterval(timer);
//       resendBtn.textContent = "Resend OTP";
//       resendBtn.disabled = false;
//     }
//   }, 1000);

//   messageEl.textContent = "Resending OTP...";
//   messageEl.style.color = "#888";

//   try {
//     const res = await fetch("http://localhost:5000/api/resend-otp", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email }),
//     });

//     const result = await res.json();

//     if (res.ok) {
//       messageEl.textContent = "✅ OTP resent successfully!";
//       messageEl.style.color = "#4caf50";
//     } else {
//       messageEl.textContent = result.message || "Failed to resend OTP";
//       messageEl.style.color = "red";
//     }
//   } catch (err) {
//     messageEl.textContent = "❌ Server error while resending OTP";
//     messageEl.style.color = "red";
//   }
// });

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

// ✅ Call this on page load automatically
window.addEventListener('load', () => {
  if (window.location.pathname.includes("otp.html")) {
    startResendOtpTimer(); // ⏳ Start 60 sec timer immediately on page load
  }
});


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

  // Immediately disable button and restart timer
  startResendOtpTimer();

  messageEl.textContent = "Resending OTP...";
  messageEl.style.color = "#888";

  try {
    const res = await fetch("http://localhost:5000/api/resend-otp", {
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

  const signupForm = document.getElementById("signupForm");
  const signinForm = document.getElementById("signinForm");
   const googleBtn = document.getElementById("googleLoginBtn"); // ✅ Google login button

  // ✅ Google login button handler
  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      window.location.href = "http://localhost:5000/auth/google"; // ✅ Your backend route
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
        const response = await fetch("http://localhost:5000/api/signup", {
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
        const response = await fetch("http://localhost:5000/api/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const result = await response.json();
        if (response.status === 200) {
          messageEl.textContent = "Login successful! Redirecting...";
          localStorage.setItem("userId", result.user.id);
          localStorage.setItem("userEmail", result.user.email);
          localStorage.setItem("userName", result.user.name);
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
  }
});
