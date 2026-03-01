const API = "https://pih2026-techx.onrender.com/api";
const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

document.addEventListener("DOMContentLoaded", () => {
  if (!token) {
    alert("Please login first");
    window.location.href = "index.html";
    return;
  }

  loadFeeds();
  loadDashboardStats();

  const form = document.getElementById("feedForm");
  if (form) {
    form.addEventListener("submit", createFeed);
  }
});

/* =========================================================
   LOAD DASHBOARD METRICS
========================================================= */
async function loadDashboardStats() {
  try {
    const res = await fetch(`${API}/feed`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to load feeds");

    const feeds = await res.json();

    const myFeeds = feeds.filter(f => f.sender?._id === userId);

    const totalMeals = myFeeds.reduce((sum, f) => sum + (f.quantity || 0), 0);
    const acceptedFeeds = myFeeds.filter(f => f.status === "accepted");

    const successRate = myFeeds.length
      ? Math.round((acceptedFeeds.length / myFeeds.length) * 100)
      : 0;

    const partnerIds = new Set(
      acceptedFeeds.map(f => f.acceptedBy?._id).filter(Boolean)
    );

    animateNumber("totalMeals", totalMeals);
    animateNumber("activePartners", partnerIds.size);

    const rateEl = document.getElementById("successRate");
    if (rateEl) rateEl.textContent = successRate + "%";

  } catch (err) {
    console.error("Dashboard Error:", err);
  }
}

/* =========================================================
   CREATE FEED
========================================================= */
async function createFeed(e) {
  e.preventDefault();

  const payload = {
    title: document.getElementById("foodTitle").value.trim(),
    description: document.getElementById("foodDescription").value.trim(),
    quantity: Number(document.getElementById("foodQuantity").value),
    location: document.getElementById("location").value.trim(),
    pickupTime: document.getElementById("pickupTime").value.trim()
  };

  try {
    const res = await fetch(`${API}/feed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to create feed");
      return;
    }

    document.getElementById("feedForm").reset();
    loadFeeds();
    loadDashboardStats();

  } catch (err) {
    console.error("Create Feed Error:", err);
  }
}

/* =========================================================
   LOAD FEEDS
========================================================= */
async function loadFeeds() {
  try {
    const res = await fetch(`${API}/feed`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to load feeds");

    const feeds = await res.json();
    const container = document.getElementById("feedContainer");
    container.innerHTML = "";

    feeds.forEach(feed => {

      const card = document.createElement("div");
      card.className = "feed-item";
      card.style.cursor = "pointer";

      card.innerHTML = `
        <h3>${feed.title}</h3>
        <div class="feed-meta">
          👤 ${feed.sender?.name || "Unknown"}
          📍 ${feed.location || ""}
          🍽 ${feed.quantity || 0} meals
          ${feed.pickupTime ? `⏰ ${feed.pickupTime}` : ""}
          • Status: ${feed.status || "pending"}
        </div>
        <p>${feed.description || ""}</p>
      `;

      // CLICK REDIRECT
      card.addEventListener("click", () => {
        localStorage.setItem("selectedFeedId", feed._id);
        console.log("Redirecting:", feed._id);

        window.location.href = "/connections.html";
      });

      container.appendChild(card);
    });

  } catch (err) {
    console.error("Load Feed Error:", err);
  }
}

/* =========================================================
   ANIMATION
========================================================= */
function animateNumber(id, value) {
  const el = document.getElementById(id);
  if (!el) return;

  let current = 0;
  const step = Math.ceil(value / 20) || 1;

  const timer = setInterval(() => {
    current += step;
    if (current >= value) {
      current = value;
      clearInterval(timer);
    }
    el.textContent = current;
  }, 30);
}
