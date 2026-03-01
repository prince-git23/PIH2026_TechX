const BASE_URL = "http://localhost:5000/api/feed";

document.addEventListener("DOMContentLoaded", () => {
  loadFeeds();
});

// ================= CREATE POST =================
document.getElementById("feedForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login first.");
    return;
  }

  const payload = {
    title: document.getElementById("foodTitle").value.trim(),
    location: document.getElementById("location").value.trim(),
    description: document.getElementById("foodDescription").value.trim(),
    quantity: document.getElementById("foodQuantity").value.trim(),
    pickupTime: document.getElementById("pickupTime").value.trim()
  };

  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    document.getElementById("feedForm").reset();

    // reload feed after posting
    loadFeeds();

  } catch (error) {
    console.error(error);
    alert("Server error");
  }
});


// ================= LOAD FEEDS =================
async function loadFeeds() {

  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch(BASE_URL, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const feeds = await res.json();
    const container = document.getElementById("feedContainer");
    container.innerHTML = "";

    feeds.forEach(feed => {

      const card = document.createElement("div");
      card.className = "feed-item";
      card.style.cursor = "pointer"; // make it clickable

      card.innerHTML = `
        <h3>${feed.title}</h3>
        <div class="feed-meta">
            👤 ${feed.sender?.name}
            📍 ${feed.location}
            🍽 ${feed.quantity} meals
            ${feed.pickupTime ? `⏰ ${feed.pickupTime}` : ""}
        </div>
        <p>${feed.description}</p>
      `;

      // 👇 CLICK REDIRECT LOGIC
      card.addEventListener("click", () => {
        localStorage.setItem("selectedFeedId", feed._id);
        window.location.href = "connections.html";
      });

      container.appendChild(card);
    });

  } catch (error) {
    console.error(error);
  }
}
