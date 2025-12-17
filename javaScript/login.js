// login.js
// This file handles the login functionality

document.addEventListener("DOMContentLoaded", () => {

    // -------------------------------
    // Show/Hide password functionality
    // -------------------------------
    const passwordInput = document.getElementById("loginPassword");
    const togglePassword = document.getElementById("togglePassword");

    if (passwordInput && togglePassword) {
        togglePassword.addEventListener("click", () => {
            passwordInput.type = passwordInput.type === "password" ? "text" : "password";
            togglePassword.classList.toggle("fa-eye-slash");
        });
    }

    // -------------------------------
    // Login form submission
    // -------------------------------
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // prevent page reload

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();

        // Check if fields are empty
        if (email === "" || password === "") {
            showMessage("Please fill in both email and password fields.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3001/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.message === "Login successful") {
                // Save user info to localStorage
                //localStorage.setItem("loggedInUser", JSON.stringify(data.user));
                const user = {
                    id: data.user.id,           // user id
                    name: data.user.fullname,   // <-- key changed from fullname to name
                    email: data.user.email      // keep email
                };

                // Redirect to homepage
                window.location.href = "../index.html";
            } else {
                // Show error message from server
                showMessage(data.message);
            }
        } catch (error) {
            console.error("Login error:", error);
            showMessage("Server error. Please try again later.");
        }
    });
});
