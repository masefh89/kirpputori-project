// this file handels the login functionality
// wait until the entire html document is loaded and parsed
document.addEventListener("DOMContentLoaded", () => {

    // Show/Hide password functionality
    const passwordInput = document.getElementById("loginPassword");
    const togglePassword = document.getElementById("togglePassword");

    if (passwordInput && togglePassword) {
        togglePassword.addEventListener("click", () => {
            const type = passwordInput.type === "password" ? "text" : "password";
            passwordInput.type = type;
            togglePassword.classList.toggle("fa-eye-slash");
        });
    }



    //get the login form element by its id
    const loginForm = document.getElementById("loginForm");

    
    // add submit event listener to the login form
    loginForm.addEventListener("submit", async(e) => {
        e.preventDefault(); // prevent the default form submission behavior, it will prevent page reload

        // get the email and password input values
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();

        //check if the email and password is empty
        if (email === "" || password === "") {
            showMessage("Please fill in both email and password fields.");
            return; // exit the function if fields are empty
        }

        fetch("http://localhost:3001/api/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(function (response){
            return response.json();

        })
        .then(function (data){
            if (data.message !== "Login successful"){
                showMessage(data.message);
                return;
            }
            localStorage.setItem("loggedInUser", JSON.stringify(data.user));

            window.location.href = "../index.html"; // redirect to homepage

        })
        .catch(function(){
            showMessage("Server error");
        })
        
    });
});