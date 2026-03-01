const BASE_URL = "https://pih2026-techx.onrender.com/api/messages";

document.addEventListener("DOMContentLoaded", () => {

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    window.location.href = "index.html";
    return;
  }

  loadConversations();

  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      document.getElementById("chatSection").style.display = "none";
      document.getElementById("conversationsContainer").style.display = "block";
    });
  }

  const sendBtn = document.getElementById("sendBtn");
  if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
  }
});


/* ================= LOAD CONVERSATIONS ================= */
async function loadConversations() {

  const token = localStorage.getItem("token");

  try {

    const res = await fetch(`${BASE_URL}/conversations`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to load conversations");

    const users = await res.json();
    const container = document.getElementById("conversationsContainer");
    container.innerHTML = "";

    if (!users.length) {
      container.innerHTML = "<p style='opacity:0.6'>No conversations yet.</p>";
      return;
    }

    users.forEach(user => {

      const div = document.createElement("div");
      div.className = "message-thread";

      div.innerHTML = `
        <strong>${user.name}</strong>
        <div class="message-meta">
          ${user.role === "sender" ? "Donor" : "NGO"}
        </div>
      `;

      div.addEventListener("click", () => openChat(user));

      container.appendChild(div);
    });

  } catch (err) {
    console.error("Conversation Load Error:", err);
  }
}


/* ================= OPEN CHAT ================= */
function openChat(user) {

  document.getElementById("chatPartnerName").textContent = user.name;

  document.getElementById("conversationsContainer").style.display = "none";
  document.getElementById("chatSection").style.display = "block";

  localStorage.setItem("activeChatUser", user._id);

  loadMessages(user._id);
}


/* ================= LOAD MESSAGES ================= */
async function loadMessages(userId) {

  const token = localStorage.getItem("token");

  try {

    const res = await fetch(`${BASE_URL}/conversation/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to load messages");

    const messages = await res.json();
    const chatWindow = document.getElementById("chatWindow");
    chatWindow.innerHTML = "";

    const myId = getMyId();

    messages.forEach(msg => {

      const bubble = document.createElement("div");

      const isMe = msg.sender._id === myId;

      bubble.className = "chat-bubble " + (isMe ? "me" : "other");

      bubble.innerHTML = `
        <div style="font-weight:600; font-size:0.75rem; margin-bottom:4px; opacity:0.8;">
          ${isMe ? "You" : msg.sender.name}
        </div>
        <div>${msg.content}</div>
        <div class="timestamp">
          ${new Date(msg.createdAt).toLocaleString()}
        </div>
      `;

      chatWindow.appendChild(bubble);
    });

    chatWindow.scrollTop = chatWindow.scrollHeight;

  } catch (err) {
    console.error("Load Messages Error:", err);
  }
}


/* ================= SEND MESSAGE ================= */
async function sendMessage() {

  const token = localStorage.getItem("token");
  const receiverId = localStorage.getItem("activeChatUser");
  const content = document.getElementById("chatMessage").value.trim();

  if (!content) return;

  try {

    const res = await fetch(`${BASE_URL}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        receiver: receiverId,
        content
      })
    });

    if (!res.ok) throw new Error("Failed to send message");

    document.getElementById("chatMessage").value = "";
    loadMessages(receiverId);

  } catch (err) {
    console.error("Send Message Error:", err);
  }
}


/* ================= GET LOGGED IN USER ID ================= */
function getMyId() {

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;
  } catch {
    return null;
  }
}
