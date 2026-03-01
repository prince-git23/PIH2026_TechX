const API = "https://pih2026-techx.onrender.com/";

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginAlert = document.getElementById("loginAlert");
const registerAlert = document.getElementById("registerAlert");

// REGISTER
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      name: document.getElementById("registerName").value,
      email: document.getElementById("registerEmail").value,
      password: prompt("Enter password"), // simple demo
      role: "sender",
      type: document.getElementById("registerType").value,
      location: document.getElementById("registerLocation").value
    };

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      registerAlert.textContent = "Registered successfully!";
    } catch (err) {
      registerAlert.textContent = err.message;
    }
  });
}

// LOGIN
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      email: document.getElementById("loginEmail").value,
      password: prompt("Enter password")
    };

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);

localStorage.setItem("userId", data.user._id);

window.location.href = "home.html";

    } catch (err) {
      loginAlert.textContent = err.message;
    }
  });
}
