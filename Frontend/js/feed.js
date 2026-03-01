const API = "http://localhost:5000/api";
const token = localStorage.getItem("token");
const feedContainer = document.getElementById("feedContainer");

if (!token) window.location.href = "index.html";

const fetchFeeds = async () => {
  const res = await fetch(`${API}/feed`, {
    headers: { Authorization: token }
  });

  const feeds = await res.json();
  renderFeeds(feeds);
};

const renderFeeds = (feeds) => {
  feedContainer.innerHTML = "";

  feeds.forEach((item) => {
    const article = document.createElement("article");
    article.className = "feed-item";

    article.innerHTML = `
      <h3>${item.sender?.name} → ${item.receiver?.name || "Unassigned"}</h3>
      <p>Quantity: ${item.quantity}</p>
      <p>Fresh Till: ${item.freshTill}</p>
      <p>Status: ${item.status}</p>
      <button onclick="updateStatus('${item._id}','accepted')">Accept</button>
      <button onclick="updateStatus('${item._id}','rejected')">Reject</button>
    `;

    feedContainer.appendChild(article);
  });
};

window.updateStatus = async (id, status) => {
  await fetch(`${API}/feed/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ status })
  });

  fetchFeeds();
};

fetchFeeds();
