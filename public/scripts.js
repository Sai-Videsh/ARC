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
let forgotEmail = "";

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

    // Forgot Password Flow
// ======================== FORGOT PASSWORD FLOW ========================

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

let forgotEmail = "";

// ✅ Step 0: When "Forgot Password?" is clicked
forgotLink?.addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("signinForm").style.display = "none";
  forgotStep1.style.display = "block";
});

// ✅ Step 1: Request OTP
// sendOtpBtn?.addEventListener("click", async () => {
//   forgotEmail = forgotEmailInput.value;

//   if (!forgotEmail) {
//     forgotMsg1.textContent = "Please enter your email.";
//     return;
//   }

//   try {
//     const res = await fetch("http://localhost:5000/api/request-password-reset", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email: forgotEmail }),
//     });

//     const result = await res.json();
//     if (res.ok) {
//       forgotMsg1.textContent = "OTP sent to your email.";
//       forgotStep1.style.display = "none";
//       forgotStep2.style.display = "block";
      

//       setTimeout(() => {
//         document.getElementById("forgotStep1").style.display = "none";
//         document.getElementById("forgotStep2").style.display = "block";
//         startOtpTimer(); // 🔁 Start the resend timer
//       }, 1500);
//     } else {
//       forgotMsg1.textContent = result.message || "Something went wrong.";
//     }
//   } catch (err) {
//     forgotMsg1.textContent = "Server error. Try again later.";
//   }
// });

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
    const res = await fetch("http://localhost:5000/api/request-password-reset", {
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
      }, 1500); // Increased to 1500ms for better UX after success message
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
  const email = localStorage.getItem("resetEmail"); // Retrieve from localStorage

  if (!email) {
    forgotMsg2.textContent = "Email missing. Please start over.";
    return;
  }

  if (!otp) {
    forgotMsg2.textContent = "Enter OTP to continue.";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/verify-password-reset-otp", {
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
    const res = await fetch("http://localhost:5000/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });

    const result = await res.json();
    if (res.ok) {
      forgotMsg3.textContent = "Password updated! Redirecting...";
      forgotMsg3.style.color = "green";
      localStorage.removeItem("resetEmail"); // Clean up
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

  // Show immediate feedback
  msg.textContent = "Resending OTP...";
  msg.style.color = "#888";

  try {
    const res = await fetch("http://localhost:5000/api/request-password-reset", {
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

  resendLink.style.pointerEvents = "none";
  resendLink.style.opacity = "0.5";
  resendLink.style.color = "#888"; // Gray when disabled

  const timerInterval = setInterval(() => {
    countdown--;
    timerText.textContent = `Resend OTP in ${countdown}s`;

    if (countdown <= 0) {
      clearInterval(timerInterval);
      timerText.textContent = "";
      resendLink.style.pointerEvents = "auto";
      resendLink.style.opacity = "1";
      resendLink.style.color = "#ffffff"; // White when enabled
    }
  }, 1000);
}

