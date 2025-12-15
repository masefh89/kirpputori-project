
//This file defines ROUTES related to registration.
//It connects routes to their respective handler functions.
// Load the express module
const express = require("express");

// Create a new router object
const router = express.Router();

// Load and import the register handler module
const registerHandler = require("../requestHandlers/register.handler");

//this route handles user registration(POST /api/register)
//when a POST request is made to /api/register, the registerUser function from the registerHandler module is called
router.post("/register", registerHandler.registerUser);

//we expoert the router that be able to use it for futeure use
// this way we can use it anywhere
module.exports = router;

