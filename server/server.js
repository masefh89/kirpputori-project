const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

// Load data
let data = require("./data.json");

// Get all listings
app.get("/listings", (req, res) => {
  res.json(data.listings);
});

// Get one listing
app.get("/listings/:id", (req, res) => {
  const listing = data.listings.find(l => l.id === req.params.id);
  listing ? res.json(listing) : res.status(404).send("Not found");
});

// Create listing
app.post("/listings", (req, res) => {
  const newListing = {
    id: Date.now().toString(),
    title: req.body.title,
    price: req.body.price,
    description: req.body.description
  };

  data.listings.push(newListing);

  // Save to file
  fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));

  res.json({ success: true, listing: newListing });
});

// Delete listing (optional)
app.delete("/listings/:id", (req, res) => {
  data.listings = data.listings.filter(l => l.id !== req.params.id);
  fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));