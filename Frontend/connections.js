const connectionsList = document.getElementById("connectionsList");

const toggle = document.getElementById("themeToggle");

const defaultConnections = [
    {
        id: "conn-1",
        name: "Helping Hearts NGO",
        location: "Kalmeshwar, Nagpur",
        type: "receiver",
        status: "Active",
        lastMeal: "120 meals dispatched"
    },
    {
        id: "conn-2",
        name: "Sehat Trust",
        location: "Civil Lines, Nagpur",
        type: "receiver",
        status: "Pending",
        lastMeal: "Awaiting pickup confirmation"
    },
    {
        id: "conn-3",
        name: "Patel Lawns",
        location: "Manewada, Nagpur",
        type: "sender",
        status: "Verified",
        lastMeal: "250 snack boxes logged"
    }
];

const state = {
    connections: JSON.parse(localStorage.getItem("annsetu-connections")) || defaultConnections
};

const persistConnections = () => {
    localStorage.setItem("annsetu-connections", JSON.stringify(state.connections));
};

const renderConnections = () => {
    if (!connectionsList) return;
    connectionsList.innerHTML = "";

    if (!state.connections.length) {
        const empty = document.createElement("p");
        empty.textContent = "No connections available.";
        empty.style.color = "var(--muted)";
        connectionsList.appendChild(empty);
        return;
    }

    state.connections.forEach((connection) => {
        const card = document.createElement("article");
        card.className = "connection-card";

        const header = document.createElement("header");
        const title = document.createElement("h3");
        title.textContent = connection.name;
        const status = document.createElement("span");
        status.textContent = connection.status;
        status.style.color =
            connection.status === "Active" ? "var(--primary)" : connection.status === "Verified" ? "var(--secondary)" : "var(--accent)";
        header.append(title, status);

        const meta = document.createElement("div");
        meta.className = "connection-meta";
        meta.innerHTML = `
            <span><strong>Type:</strong> ${connection.type}</span>
            <span><strong>Location:</strong> ${connection.location}</span>
        `;
        const footer = document.createElement("footer");
        const last = document.createElement("p");
        last.textContent = connection.lastMeal;
        footer.appendChild(last);
        card.append(header, meta, footer);
        connectionsList.appendChild(card);
    });
};

renderConnections();
