const BASE_URL = "https://pih2026-techx.onrender.com/api";
const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", async () => {

  const feedId = localStorage.getItem("selectedFeedId");

  if (!token) {
    alert("Please login first");
    window.location.href = "index.html";
    return;
  }

  if (!feedId) {
    console.log("No feed selected");
    return;
  }

  try {
    // ✅ FIXED → call /feed
    const res = await fetch(`${BASE_URL}/feed`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to load feeds");

    const feeds = await res.json();
    const feed = feeds.find(f => f._id === feedId);

    if (!feed) {
      console.log("Feed not found");
      return;
    }

    renderFeedDetails(feed);

  } catch (error) {
    console.error("Load Error:", error);
  }
});


/* =========================================================
   RENDER FEED
========================================================= */
function renderFeedDetails(feed) {

  const container = document.querySelector(".connections-container");
  if (!container) return;

  container.innerHTML = `
    <div class="feed-item">
      <h3>${feed.title}</h3>

      <div class="feed-meta">
        👤 ${feed.sender?.name || "Unknown Sender"}
        📍 ${feed.location || ""}
        🍽 ${feed.quantity || 0} meals
        ${feed.pickupTime ? `⏰ ${feed.pickupTime}` : ""}
      </div>

      <p>${feed.description || ""}</p>

      <div class="feed-actions" style="margin-top:15px; display:flex; gap:12px;">
        ${feed.status === "pending" ? `
          <button class="btn primary" id="acceptBtn">Accept</button>
          <button class="btn secondary" id="rejectBtn">Reject</button>
        ` : `
          <div style="font-weight:600; color:${feed.status === "accepted" ? "#22c55e" : "#ef4444"};">
            Status: ${feed.status.toUpperCase()}
          </div>
        `}
      </div>

      <div id="statusLog" style="margin-top:15px;"></div>

    </div>
  `;

  if (feed.status === "pending") {
    document.getElementById("acceptBtn")
      ?.addEventListener("click", () => updateStatus(feed._id, "accepted"));

    document.getElementById("rejectBtn")
      ?.addEventListener("click", () => updateStatus(feed._id, "rejected"));
  }
}


/* =========================================================
   UPDATE STATUS
========================================================= */
async function updateStatus(feedId, status) {

  try {

    // ✅ FIXED → call /feed/:id/status
    const res = await fetch(`${BASE_URL}/feed/${feedId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error updating status");
      return;
    }

    document.getElementById("statusLog").innerHTML = `
      <div style="color:${status === "accepted" ? "#22c55e" : "#ef4444"}; font-weight:600;">
        ✔ Feed ${status}
      </div>
    `;

    // Reload after update
    setTimeout(() => location.reload(), 1000);

  } catch (error) {
    console.error("Update Error:", error);
  }
}
