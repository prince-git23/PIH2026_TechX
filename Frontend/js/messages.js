const BASE_URL = "https://pih2026-techx.onrender.com/api";

document.addEventListener("DOMContentLoaded", () => {
  loadConversations();

  document.getElementById("backBtn").addEventListener("click", () => {
    document.getElementById("chatSection").style.display = "none";
    document.getElementById("conversationsContainer").style.display = "block";
  });

  document.getElementById("sendBtn").addEventListener("click", sendMessage);
});


// ================= LOAD CONVERSATIONS =================
async function loadConversations() {

  const token = localStorage.getItem("token");
  if (!token) return;

  const res = await fetch(`${BASE_URL}/conversations`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const users = await res.json();
  const container = document.getElementById("conversationsContainer");
  container.innerHTML = "";

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
}


// ================= OPEN CHAT =================
function openChat(user) {

  document.getElementById("chatPartnerName").textContent = user.name;

  document.getElementById("conversationsContainer").style.display = "none";
  document.getElementById("chatSection").style.display = "block";

  localStorage.setItem("activeChatUser", user._id);

  loadMessages(user._id);
}


// ================= LOAD MESSAGES =================
async function loadMessages(userId) {

  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/conversation/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const messages = await res.json();
  const chatWindow = document.getElementById("chatWindow");
  chatWindow.innerHTML = "";

  messages.forEach(msg => {

    const bubble = document.createElement("div");

    const isMe = msg.sender._id === getMyId();

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
}


// ================= SEND MESSAGE =================
async function sendMessage() {

  const token = localStorage.getItem("token");
  const receiverId = localStorage.getItem("activeChatUser");
  const content = document.getElementById("chatMessage").value.trim();

  if (!content) return;

  await fetch(`${BASE_URL}/send`, {
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

  document.getElementById("chatMessage").value = "";

  loadMessages(receiverId);
}


// ================= GET LOGGED IN USER ID =================
function getMyId() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.id;
}
