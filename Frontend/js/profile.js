const profileForm = document.getElementById("profileForm");
const profileAlert = document.getElementById("profileAlert");

const loadProfile = () => {
    const auth = JSON.parse(sessionStorage.getItem("annsetu-auth"));
    if (!auth) return;
    document.getElementById("profileName").value = auth.name || "";
    document.getElementById("profileEmail").value = auth.email || "";
    document.getElementById("profileLocation").value = auth.location || "";
    document.getElementById("profileType").value = auth.type || "";
};

const toggle = document.getElementById("themeToggle");



const notify = (message, success = true) => {
    profileAlert.textContent = message;
    profileAlert.style.color = success ? "var(--primary)" : "var(--accent)";
};

const persistProfile = (payload) => {
    sessionStorage.setItem("annsetu-auth", JSON.stringify(payload));
};

const handleProfileSave = (event) => {
    event.preventDefault();
    const name = document.getElementById("profileName").value.trim();
    const email = document.getElementById("profileEmail").value.trim().toLowerCase();
    const location = document.getElementById("profileLocation").value.trim();
    const type = document.getElementById("profileType").value;
    const categories = document.getElementById("profileCategories").value.trim();
    const socials = document.getElementById("profileSocial").value.trim();

    try {
        if (!name || !email || !location || !type) {
            throw new Error("Required fields cannot be omitted.");
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error("Please enter a valid email.");
        }

        persistProfile({ name, email, location, type, categories, socials });
        notify("Profile has been successfully saved.");
    } catch (error) {
        notify(error.message, false);
    }
};

if (profileForm) {
    profileForm.addEventListener("submit", handleProfileSave);
}

document.addEventListener("DOMContentLoaded", loadProfile);
