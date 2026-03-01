const animateCounter = (id, target, suffix = "") => {
    const el = document.getElementById(id);
    if (!el) return;

    let count = 0;
    const step = target / 60;

    const interval = setInterval(() => {
        count += step;
        if (count >= target) {
            el.textContent = target + suffix;
            clearInterval(interval);
        } else {
            el.textContent = Math.floor(count) + suffix;
        }
    }, 16);
};

animateCounter("totalMeals", 570);
animateCounter("activePartners", 12);
animateCounter("successRate", 92, "%");


const feedContainer = document.getElementById("feedContainer");

const mockFeed = [
    {
        id: "feed-1",
        sender: "Vivekanand Boys Hostel",
        location: "Nagpur Campus",
        quantity: "120 meals",
        freshTill: "19:00",
        receiver: "Helping Hearts NGO",
        receiverLocation: "Kalmeshwar, Nagpur",
        status: "pending",
        requirement: "Cooked meals, non-veg ok"
    },
    {
        id: "feed-2",
        sender: "Ram Hotel",
        location: "Manewada Block 2",
        quantity: "200 packed meals",
        freshTill: "22:30",
        receiver: "Sehat Trust",
        receiverLocation: "Civil Lines, Nagpur",
        status: "pending",
        requirement: "Vegetarian, sealed packets"
    },
    {
        id: "feed-3",
        sender: "Patel Lawns",
        location: "Nagpur",
        quantity: "250 snack boxes",
        freshTill: "17:00",
        receiver: "Community Kitchens",
        receiverLocation: "Itwari, Nagpur",
        status: "pending",
        requirement: "Fresh fruits, juices"
    }
];

const state = {
    feed: JSON.parse(localStorage.getItem("annsetu-feed")) || mockFeed
};

const persistFeed = () => {
    localStorage.setItem("annsetu-feed", JSON.stringify(state.feed));
};

const createFeedElement = (item) => {
    const article = document.createElement("article");
    article.className = "feed-item";
    article.dataset.id = item.id;

    const header = document.createElement("header");
    const title = document.createElement("h3");
    title.textContent = `${item.sender} → ${item.receiver}`;
    header.appendChild(title);

    const meta = document.createElement("div");
    meta.className = "feed-meta";
    meta.innerHTML = `
        <span><strong>location:</strong> ${item.location}</span>
        <span><strong>receiver:</strong> ${item.receiverLocation}</span>
        <span><strong>fresh till:</strong> ${item.freshTill}</span>
    `;

    const body = document.createElement("p");
    body.textContent = `Quantity: ${item.quantity} • Requirement: ${item.requirement}`;

    const actions = document.createElement("div");
    actions.className = "feed-actions";

    const accept = document.createElement("button");
    accept.className = "btn primary";
    accept.textContent = "Accept";
    accept.type = "button";
    accept.addEventListener("click", () => updateStatus(item.id, "accepted"));

    const reject = document.createElement("button");
    reject.className = "btn secondary";
    reject.textContent = "Reject";
    reject.type = "button";
    reject.addEventListener("click", () => updateStatus(item.id, "rejected"));

    const statusBadge = document.createElement("span");
    statusBadge.textContent = item.status.toUpperCase();
    statusBadge.style.marginLeft = "auto";
    statusBadge.style.fontWeight = "700";
    statusBadge.style.color = item.status === "accepted" ? "var(--primary)" : item.status === "rejected" ? "var(--accent)" : "var(--muted)";

    actions.append(accept, reject, statusBadge);

    article.append(header, meta, body, actions);


    statusBadge.className = `badge ${item.status}`;//added
    statusBadge.textContent = item.status.toUpperCase();
    return article;
};

const renderFeed = () => {
    if (!feedContainer) return;

    feedContainer.innerHTML = "";
    const feedData = state.feed;
    if (!feedData.length) {
        const empty = document.createElement("p");
        empty.textContent = "No feed entries available. Check back soon.";
        empty.style.color = "var(--muted)";
        feedContainer.appendChild(empty);
        return;
    }

    feedData.forEach((item) => {
        feedContainer.appendChild(createFeedElement(item));
    });
};

const updateStatus = (id, status) => {
    const feedIndex = state.feed.findIndex((entry) => entry.id === id);
    if (feedIndex === -1) return;

    state.feed[feedIndex] = { ...state.feed[feedIndex], status };
    persistFeed();
    renderFeed();
};

renderFeed();
