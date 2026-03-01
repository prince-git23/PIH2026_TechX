const BASE_URL = "https://pih2026-techx.onrender.com/api";

document.addEventListener("DOMContentLoaded", async () => {

  const token = localStorage.getItem("token");
  const feedId = localStorage.getItem("selectedFeedId");

  if (!token || !feedId) {
    console.log("Missing token or feed ID");
    return;
  }

  try {

    const res = await fetch(`${BASE_URL}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const feeds = await res.json();
    const feed = feeds.find(f => f._id === feedId);

    if (!feed) {
      console.log("Feed not found");
      return;
    }

    renderFeedDetails(feed);

  } catch (error) {
    console.error(error);
  }

});


function renderFeedDetails(feed) {

  const container = document.querySelector(".connections-container");
  if (!container) return;

  container.innerHTML = `
    <div class="feed-item">
      <h3>${feed.title}</h3>

      <div class="feed-meta">
        👤 ${feed.sender?.name || "Unknown Sender"}
        📍 ${feed.location}
        🍽 ${feed.quantity} meals
        ${feed.pickupTime ? `⏰ ${feed.pickupTime}` : ""}
      </div>

      <p>${feed.description}</p>

      <div class="feed-actions" style="margin-top:15px; display:flex; gap:12px;">
        <button class="btn primary" id="acceptBtn">
          Accept
        </button>
        <button class="btn secondary" id="rejectBtn">
          Reject
        </button>
      </div>

      <div id="statusLog" style="margin-top:15px;"></div>

    </div>
  `;

  // Attach events AFTER rendering
  document.getElementById("acceptBtn")
    .addEventListener("click", () => updateStatus(feed._id, "accepted"));

  document.getElementById("rejectBtn")
    .addEventListener("click", () => updateStatus(feed._id, "rejected"));
}


async function updateStatus(feedId, status) {

  const token = localStorage.getItem("token");

  try {

    const res = await fetch(`${BASE_URL}/${feedId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error updating status");
      return;
    }

    document.getElementById("statusLog").innerHTML = `
      <div style="color:${status === "accepted" ? "#22c55e" : "#ef4444"};">
        ✔ Feed ${status}
      </div>
    `;

  } catch (error) {
    console.error(error);
  }
}
