// items.handler.js
// This file handles all logic for getting items from data.json

const fs = require("fs");
const path = require("path");

// Function to get all listings (items)
function getItems(req, res) {
    const dataPath = path.join(__dirname, "..", "data", "data.json"); // Single JSON file

    fs.readFile(dataPath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Failed to read data file" });
        }

        try {
            const allData = JSON.parse(data); // Parse entire JSON file
            const listings = allData.listings || []; // Get listings array
            res.json(listings); // Send only listings to frontend
        } catch (parseError) {
            res.status(500).json({ error: "Failed to parse JSON data" });
        }
    });
}

module.exports = { getItems };
