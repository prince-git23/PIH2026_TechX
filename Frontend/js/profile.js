const API = "http://localhost:5000/api";
const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

document.addEventListener("DOMContentLoaded", initProfile);

async function initProfile() {
    if (!token) {
        alert("Please login first");
        window.location.href = "index.html";
        return;
    }

    try {
        // ================= LOAD USER =================
        const resUser = await fetch(`${API}/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const user = await resUser.json();

        document.getElementById("premiumProfileName").textContent = user.name;
        document.getElementById("premiumRole").textContent = user.role.toUpperCase();

        if (user.verified) {
            const badge = document.getElementById("verificationBadge");
            badge.textContent = user.verificationLevel.toUpperCase();
            badge.classList.remove("unverified");
            badge.classList.add("verified");
        }

        // ================= LOAD FEEDS =================
        const resFeeds = await fetch(`${API}/feed`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const feeds = await resFeeds.json();

        const myFeeds = feeds.filter(f => f.sender._id === userId);

        const total = myFeeds.length;
        const accepted = myFeeds.filter(f => f.status === "accepted").length;
        const meals = myFeeds.reduce((sum, f) => sum + f.quantity, 0);
        const success = total ? Math.round((accepted / total) * 100) : 0;
        const reputation = accepted * 10;

        animateNumber("totalDonations", total);
        animateNumber("acceptedDonations", accepted);
        animateNumber("mealsServed", meals);
        animateNumber("reputationScore", reputation);

        document.getElementById("successRate").textContent = success + "%";
        document.getElementById("trustProgress").style.width = success + "%";

        // ================= ACTIVITY =================
        const activity = document.getElementById("activityList");
        activity.innerHTML = "";

        myFeeds.slice(0, 5).forEach(feed => {
            const li = document.createElement("li");
            li.textContent = `Donation "${feed.title}" → ${feed.status}`;
            activity.appendChild(li);
        });

    } catch (err) {
        console.error(err);
    }
}

function animateNumber(id, value) {
    const el = document.getElementById(id);
    let current = 0;
    const step = Math.ceil(value / 20);

    const timer = setInterval(() => {
        current += step;
        if (current >= value) {
            current = value;
            clearInterval(timer);
        }
        el.textContent = current;
    }, 30);
}
