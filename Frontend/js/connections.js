const API = "http://localhost:5000/api";
const token = localStorage.getItem("token");
const connectionsList = document.getElementById("connectionsList");

const fetchConnections = async () => {
  const res = await fetch(`${API}/connections`, {
    headers: { Authorization: token }
  });

  const connections = await res.json();
  connectionsList.innerHTML = "";

  connections.forEach((conn) => {
    const card = document.createElement("div");
    card.className = "connection-card";
    card.innerHTML = `
      <h3>${conn.name}</h3>
      <p>${conn.location}</p>
      <p>Status: ${conn.status}</p>
    `;
    connectionsList.appendChild(card);
  });
};

fetchConnections();
