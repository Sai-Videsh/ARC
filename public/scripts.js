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

// ========== THEME TOGGLE ==========
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

// ========== PASSWORD VISIBILITY ==========
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

function openSignupPage() {
  window.location.href = "signup.html";
}
function openSigninPage() {
  window.location.href = "signin.html";
}

// ========== OTP VERIFICATION FROM otp.html ==========
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');
if (window.location.pathname.includes("otp.html") && !email) {
  alert("Invalid access. Email is missing from URL.");
  window.location.href = "signup.html";
}

document.getElementById('otpForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();

  const otp = document.getElementById('otp').value;
  const messageEl = document.getElementById('otp-message');
  const submitBtn = document.querySelector('.submit-btn');
  const loadingOverlay = document.getElementById('loadingOverlay');

  if (!otp) {
    messageEl.textContent = "Please enter the OTP";
    return;
  }

  if (!/^\d{6}$/.test(otp)) {
    messageEl.textContent = "OTP must be a 6-digit number";
    return;
  }

  submitBtn.classList.add('loading');
  messageEl.textContent = "Verifying OTP...";
  messageEl.style.color = document.body.classList.contains('dark-theme') ? "#aaaaaa" : "#555555";
  loadingOverlay.classList.add('active');

  try {
    const res = await fetch("http://localhost:5000/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    loadingOverlay.classList.remove('active');
    submitBtn.classList.remove('loading');

    if (res.ok) {
      messageEl.textContent = "OTP verified successfully! Redirecting...";
      messageEl.style.color = document.body.classList.contains('dark-theme') ? "#4caf50" : "#388e3c";
      setTimeout(() => {
        window.location.href = "signin.html";
      }, 1500);
    } else {
      messageEl.textContent = data.message || "Verification failed";
      messageEl.style.color = "red";
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    messageEl.textContent = "❌ Server error. Try again later.";
    messageEl.style.color = "red";
    loadingOverlay.classList.remove('active');
    submitBtn.classList.remove('loading');
  }
});

document.getElementById('resendOtp')?.addEventListener('click', async function (e) {
  e.preventDefault();
  const messageEl = document.getElementById('otp-message');
  messageEl.textContent = "Resending OTP...";
  messageEl.style.color = document.body.classList.contains('dark-theme') ? "#aaaaaa" : "#555555";

  setTimeout(() => {
    messageEl.textContent = `OTP resent to ${email}`;
    messageEl.style.color = document.body.classList.contains('dark-theme') ? "#4caf50" : "#388e3c";
  }, 1500);
});

// ========== FORM SUBMISSION HANDLERS ==========
document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("load", createAirBubbles);

  const signupForm = document.getElementById("bdy") || document.getElementById("signupForm");
  const signinForm = document.getElementById("signinForm");

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("fullName").value;
      const phone = document.getElementById("phone").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const address = document.getElementById("address").value;
      const messageEl = document.getElementById("signup-message") || document.getElementById("error");
      const submitBtn = document.querySelector(".submit-btn");
      const loadingOverlay = document.getElementById("loadingOverlay");

      if (!name || !phone || !email || !password || !confirmPassword || !address) {
        messageEl.textContent = "Please fill in all fields";
        return;
      }
      if (name.length < 2) {
        messageEl.textContent = "Full name must be at least 2 characters";
        return;
      }
      if (!/^\+?\d{10,15}$/.test(phone)) {
        messageEl.textContent = "Please enter a valid phone number";
        return;
      }
      // if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      //   messageEl.textContent = "Please enter a valid email address";
      //   return;
      // }
      if (password.length < 6) {
        messageEl.textContent = "Password must be at least 6 characters";
        return;
      }
      if (password !== confirmPassword) {
        messageEl.textContent = "Passwords do not match";
        return;
      }
      if (address.length < 10) {
        messageEl.textContent = "Please enter a valid address";
        return;
      }

      submitBtn?.classList.add("loading");
      messageEl.textContent = "Creating account...";

      setTimeout(() => {
        loadingOverlay?.classList.add("active");
      }, 500);

      const formData = { name, phone, email, password, address };

      try {
        const response = await fetch("http://localhost:5000/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
          messageEl.textContent = "Account created successfully! Redirecting...";
          setTimeout(() => {
            window.location.href = `otp.html?email=${encodeURIComponent(email)}`;
          }, 1500);
        } else {
          messageEl.textContent = result.message || result.msg || "Signup failed";
        }
      } catch (error) {
        messageEl.textContent = "Error signing up";
      } finally {
        loadingOverlay?.classList.remove("active");
        submitBtn?.classList.remove("loading");
      }
    });
  }

  if (signinForm) {
    signinForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
      };
      const messageSpan = document.getElementById("signin-message") || document.getElementById("error");

      try {
        const response = await fetch("http://localhost:5000/api/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        const message = result.msg || result.message || "Unknown response";

        if (response.status === 200) {
          localStorage.setItem("userId", result.user.id);
          localStorage.setItem("userEmail", result.user.email);
          localStorage.setItem("userName", result.user.name);
          messageSpan.textContent = message;
          messageSpan.style.color = "green";
          setTimeout(() => {
            window.location.href = "dashboard1.html";
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
});
