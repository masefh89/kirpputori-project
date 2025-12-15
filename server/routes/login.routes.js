// 1. Load the Express library and get the Router tool
// Router helps organize routes (URLs) into separate files
const express = require("express");
const router = express.Router();

// 2. Import the login function from another file
// "../" means "go up one folder level"
// "./" means "current folder"
const { loginUser } = require("../requestHandlers/login.handler");

// 3. Tell Express: "When someone sends a POST request to /login, 
//    use the loginUser function to handle it"
// POST is used for sending data (like login forms)
router.post("/login", loginUser);

// 4. Export the router so other files can use it
// This makes all our routes available to the main app
module.exports = router;