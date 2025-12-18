// items.routes.js
// Defines API routes related to items

const express = require("express");
const router = express.Router(); // Create router
const { getItems } = require("../requestHandlers/items.handler"); // Import handler

// GET /api/items → returns all items
router.get("/items", getItems);

module.exports = router; // Export the router
