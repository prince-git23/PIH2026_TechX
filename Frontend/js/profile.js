const API = "https://pih2026-techx.onrender.com/api";

document.addEventListener("DOMContentLoaded", initProfile);

async function initProfile() {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        window.location.href = "index.html";
        return;
    }

    try {

        /* ================= LOAD USER ================= */

        const resUser = await fetch(`${API}/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!resUser.ok) {
            throw new Error("Failed to load user");
        }

        const user = await resUser.json();

        // Save userId properly (FIX)
        const userId = user._id;

        document.getElementById("premiumProfileName").textContent = user.name || "User";
        document.getElementById("premiumRole").textContent = (user.role || "").toUpperCase();

        if (user.verified) {
            const badge = document.getElementById("verificationBadge");
            if (badge) {
                badge.textContent = (user.verificationLevel || "verified").toUpperCase();
                badge.classList.remove("unverified");
                badge.classList.add("verified");
            }
        }

        /* ================= LOAD FEEDS ================= */

        const resFeeds = await fetch(`${API}/feed`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!resFeeds.ok) {
            throw new Error("Failed to load feeds");
        }

        const feeds = await resFeeds.json();

        // FIXED filter
        const myFeeds = feeds.filter(f => f.sender?._id === userId);

        const total = myFeeds.length;
        const accepted = myFeeds.filter(f => f.status === "accepted").length;
        const meals = myFeeds.reduce((sum, f) => sum + (f.quantity || 0), 0);
        const success = total ? Math.round((accepted / total) * 100) : 0;
        const reputation = accepted * 10;

        animateNumber("totalDonations", total);
        animateNumber("acceptedDonations", accepted);
        animateNumber("mealsServed", meals);
        animateNumber("reputationScore", reputation);

        const successEl = document.getElementById("successRate");
        if (successEl) successEl.textContent = success + "%";

        const trustBar = document.getElementById("trustProgress");
        if (trustBar) trustBar.style.width = success + "%";

        /* ================= ACTIVITY ================= */

        const activity = document.getElementById("activityList");
        if (activity) {
            activity.innerHTML = "";

            if (!myFeeds.length) {
                activity.innerHTML = "<li>No activity yet.</li>";
            } else {
                myFeeds.slice(0, 5).forEach(feed => {
                    const li = document.createElement("li");
                    li.textContent = `Donation "${feed.title}" → ${feed.status}`;
                    activity.appendChild(li);
                });
            }
        }

    } catch (err) {
        console.error("Profile Error:", err);
    }
}


/* ================= ANIMATION ================= */

function animateNumber(id, value) {

    const el = document.getElementById(id);
    if (!el) return;

    let current = 0;
    const step = Math.ceil(value / 20) || 1;

    const timer = setInterval(() => {
        current += step;
        if (current >= value) {
            current = value;
            clearInterval(timer);
        }
        el.textContent = current;
    }, 30);
}
