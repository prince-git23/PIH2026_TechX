const API = "http://localhost:5000/api";
const token = localStorage.getItem("token");
const threadsContainer = document.getElementById("messageThreads");
const messageForm = document.getElementById("messageForm");

if (!token) window.location.href = "index.html";

const fetchMessages = async () => {
  const res = await fetch(`${API}/messages`, {
    headers: { Authorization: token }
  });

  const messages = await res.json();
  threadsContainer.innerHTML = "";

  messages.forEach((msg) => {
    const div = document.createElement("div");
    div.className = "message-thread";
    div.innerHTML = `
      <h3>${msg.recipient}</h3>
      <p>${msg.content}</p>
    `;
    threadsContainer.appendChild(div);
  });
};

if (messageForm) {
  messageForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      recipient: document.getElementById("messageRecipient").value,
      content: document.getElementById("messageContent").value
    };

    await fetch(`${API}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify(payload)
    });

    messageForm.reset();
    fetchMessages();
  });
}

fetchMessages();