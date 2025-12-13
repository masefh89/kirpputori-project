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
    registerForm.addEventListener("submit", (e)=>{
        e.preventDefault(); // Prevent the default form submission behavior, stops page reload

        //get the input values from the form fields
        const fullname = document.getElementById("registerFullname").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("registerConfirmPassword").value;

        //check if any of the fields are empty
        if(fullname === "" || email === "" || password === "" || confirmPassword === ""){
            showMessage("Please fill in all the fields.");
            return; // Exit the function if fields are empty
        }

        //redirect to the login page after successful registration
        window.location.href = "../pages/login.html"; // Redirect to login page
    });

});

