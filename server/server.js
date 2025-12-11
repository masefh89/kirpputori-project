const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));

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
  const favorites = []
  //get the date
  const now = new Date();

  const published = now.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  //compile the data to one variable
  const newListing = {
    id: req.body.id,
    title: req.body.title,
    briefDescription: req.body.briefDescription,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    type: req.body.type,
    location: req.body.location,
    date: published,
    favorites: favorites,
    image: req.body.image
  };

  // Add to data
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