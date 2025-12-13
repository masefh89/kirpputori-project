//wait until the entire html document is loaded and parsed
document.addEventListener("DOMContentLoaded", ()=>{
    const navbarFile = "/components/navbar.html";
    // we are using fetch to load the navbar HTML file, the fetch gets an argument and in this case 
    // it's the navbarFile variable
    // fetch returns a promise, so we use .then() to handle the response
    fetch(navbarFile)
    .then(res => res.text()) // we get the response and convert the response to text with the method .text()
    .then(data => {
        // we get the data (which is the HTML content of the navbar file)
        // we find the <nav> element in the current document
        const navbarDiv = document.getElementById("navbar-placeholder");
        // we set the innerHTML of the navbarDiv to the data we fetched
        navbarDiv.innerHTML = data;
        // after inserting the navbar, we can now manipulate it if needed
        // we are gonna add a dropdown menu for "My-account"
        setupAccountMenu();
    });
    

});



// function to setup the account dropdown menu in the navbar
function setupAccountMenu(){
    //get the <li> element that contains the "My-account" link
    const accountDropdownMenu = document.getElementById("accountDropdownMenu");

    

    //check if user is logged in by looking for "loggedInUser" in localStorage
    const loggedInUser = localStorage.getItem("loggedInUser") === "true";

    // get the username from localStorage if available
    const username = localStorage.getItem("username");

    if (!loggedInUser) {
        // if the user is not logged in, show "Login" and "Register" options
        // we use the linkPrefix variable to set the correct paths for the links inside the dolar sign braces ${}
        accountDropdownMenu.innerHTML = `
        <li><a class="dropdown-item" href="/pages/login.html">Login</a></li>
        <li><a class="dropdown-item" href="/pages/register.html">Register</a></li>
        `;

    } else {
        // If the user IS logged in, show Profile, Manage Items, Sell Items, and Logout options
        
        accountDropdownMenu.innerHTML = `
        <li><a class="dropdown-item" href="/pages/profile.html">Profile</a></li>
        <li><a class="dropdown-item" href="/pages/manageItems.html">Manage Items</a></li>
        <li><a class="dropdown-item" href="/pages/sellItem.html">Sell Item</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>            
        
        `;
        // add event listener to the logout button
        // When clicked, it logs the user out and reloads the page
        const logoutBtn = document.getElementById("logoutBtn");
        // add click event listener to logout button
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();// prevent default link behavior
            localStorage.removeItem("loggedInUser"); // remove loggedInUser from localStorage   
            localStorage.removeItem("username"); // remove username from localStorage
            // we can redirect to the homepage after logout
            window.location.href = "/index.html"; // redirect to homepage
        });
    }
}