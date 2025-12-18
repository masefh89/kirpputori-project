/*
  register.js
  This file handles all JavaScript logic
  related to the registration page.
*/

// Wait until the HTML page is fully loaded
document.addEventListener("DOMContentLoaded", ()=>{

    // Show/Hide password functionality
    const passwordInput = document.getElementById("registerPassword");
    const togglePassword = document.getElementById("togglePassword");

    if (passwordInput && togglePassword) {
        togglePassword.addEventListener("click", () => {
            const type = passwordInput.type === "password" ? "text" : "password";
            passwordInput.type = type;
            togglePassword.classList.toggle("fa-eye-slash");
        });
    }

    // ===== Show/Hide confirm password =====
    const confirmInput = document.getElementById("registerConfirmPassword");
    const toggleConfirm = document.getElementById("toggleConfirmPassword");

    if (confirmInput && toggleConfirm) {
        toggleConfirm.addEventListener("click", () => {
            confirmInput.type = confirmInput.type === "password" ? "text" : "password";
            toggleConfirm.classList.toggle("fa-eye-slash");
        });
    }





    // Get the registration form element by its id
    const registerForm = document.getElementById("registerForm");

    // Get the terms and conditions checkbox element by its id
    const termsCheckbox = document.getElementById("termsCheckbox");


    // Get the register button element by its id
    const registerButton = document.getElementById("registerButton");

    // Enable or disable the Register button based on checkbox state
    termsCheckbox.addEventListener("change", ()=>{
        registerButton.disabled = !termsCheckbox.checked;
    });

    // Add submit event listener to the registration form
    registerForm.addEventListener("submit", async(e)=>{
        e.preventDefault(); // Prevent the default form submission behavior, stops page reload

        //get the input values from the form fields
        const fullname = document.getElementById("registerFullname").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("registerConfirmPassword").value;

        //check if any of the fields are empty
        if(fullname === "" || email === "" || password === "" || confirmPassword === ""){
            alert("Please fill in all the fields.");
            return; // Exit the function if fields are empty
        }
        if (password !== confirmPassword) {
            // Check if password and confirm password don't match
            alert("Passwords do not match.");
            // Show error message and stop the registration process
            return;
        }
        // Try to send registration data to the server
        try{
            // Send a POST request to the registration API endpoint
            const response = await fetch("http://localhost:3001/api/register", {
                method: "POST", // Use POST method to send data
                headers:{
                    "Content-Type": "application/json" // Tell server we're sending JSON
                },
                body: JSON.stringify({  // Convert data to JSON string
                    fullname,
                    email,
                    password
                })
            });
            // Convert server response from JSON to JavaScript object
            const result = await response.json();

            
            // Check if the server responded with an error
            if (!response.ok){
                alert(result.message || "Registration failed.")
                return;
            }
            if (!result.user) {
                alert("Registration failed: no user data returned.");
                return;
            }

            const newUser = {
                id: result.user.id,
                name: result.user.fullname,  
                email: result.user.email
            };
            localStorage.setItem("loggedInUser", JSON.stringify(newUser));
            window.location.href = "../index.html";

            
        } catch (error) { // Handle any network or unexpected errors
            alert("Something went wrong, please try again later.")
        }

    });

});

