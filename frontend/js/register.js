const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/v1/auth/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role
                })
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {

            message.style.color = "red";
            message.textContent =
                data.message || "Registration failed";

            return;
        }

        // Save JWT Token
        localStorage.setItem("token", data.token);

        // Save User Information
        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        message.style.color = "green";
        message.textContent =
            "Registration Successful";

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