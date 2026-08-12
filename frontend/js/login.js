const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/v1/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {

            message.style.color = "red";
            message.textContent =
                data.message || "Login failed";

            return;
        }

        // Save JWT Token
        localStorage.setItem("token", data.token);

        // Save User Details
        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        message.style.color = "green";
        message.textContent = "Login Successful";

        setTimeout(() => {

            window.location.href = "index.html";

        }, 1000);

    } catch (error) {

        console.error(error);

        message.style.color = "red";
        message.textContent =
            "Unable to connect to server.";

    }

});