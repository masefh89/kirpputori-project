const express = require("express");
const cors = require("cors");
const fs = require("fs");

const registerRoutes = require("./routes/register.routes");
const loginRoutes = require("./routes/login.routes");

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.options("/listings/:id", cors());

const DATA_PATH = "./data/listings.json";

//next is needed for editing the listings to work
//loads listings
function loadListings() {
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
}
//saves listings
function saveListings(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}


// Get all listings
app.get("/listings", (req, res) => {
  const data = loadListings();
  res.json(data.listings);
});

// Get one listing by ID
app.get("/listings/:id", (req, res) => {
  const data = loadListings();
  const listing = data.listings.find(l => l.id === req.params.id);

  if (!listing) {
    return res.status(404).json({ success: false, message: "Not found" });
  }

  res.json(listing);
});

// Create listing
app.post("/listings", (req, res) => {
  const data = loadListings();

  const now = new Date();
  const published = now.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  
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
    favorites: [],
    image: req.body.image,
    sellerName: req.body.sellerName,
    sellerId: req.body.sellerId
  };

  data.listings.push(newListing);
  saveListings(data);

  res.json({ success: true, listing: newListing });
});

// Update listing
app.put("/listings/:id", (req, res) => {
  console.log("PUT called with ID:", req.params.id);

  const data = loadListings();
  const listing = data.listings.find(l => l.id === req.params.id);

  //checks if listing exists
  if (!listing) {
    console.log("Listing not found!");
    return res.status(404).json({ success: false, message: "Listing not found" });
  }

  const editableFields = [
    "title",
    "briefDescription",
    "description",
    "price",
    "category",
    "type",
    "location"
  ];

  editableFields.forEach(field => {
    if (req.body[field] !== undefined) {
      listing[field] = req.body[field];
    }
  });

  saveListings(data);

  res.json({ success: true, listing });
});

// Delete listing
app.delete("/listings/:id", (req, res) => {
  const data = loadListings();
  data.listings = data.listings.filter(l => l.id !== req.params.id);
  saveListings(data);

  res.json({ success: true });
});

//user routes

app.use("/api", loginRoutes);
app.use("/api", registerRoutes);

//server start

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});