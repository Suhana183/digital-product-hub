const token = localStorage.getItem("token");

const user = JSON.parse(localStorage.getItem("user"));

const loginLink = document.getElementById("login-link");
const registerLink = document.getElementById("register-link");
const welcomeUser = document.getElementById("welcome-user");
const logoutBtn = document.getElementById("logout-btn");

if (token && user) {

    if (loginLink) loginLink.style.display = "none";

    if (registerLink) registerLink.style.display = "none";

    if (welcomeUser) {
        welcomeUser.textContent = `Welcome, ${user.name}`;
    }

    if (logoutBtn) {
        logoutBtn.style.display = "inline-block";
    }
}

logoutBtn?.addEventListener("click", () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged out successfully.");

    window.location.href = "login.html";

});