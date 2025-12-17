const express = require("express"); // Load the Express library to create a web server

const cors = require("cors"); // Load the CORS library to handle cross-origin requests

const fs = require("fs"); // Load the File System library to work with files
const registerRoutes = require("./routes/register.routes"); // Load our custom routes from the register.routes.js file
const loginRoutes = require("./routes/login.routes");


const app = express(); // Create an Express application (our web server)
const PORT = 3001;// Define the port number where our server will listen

app.use(express.json()); // Tell Express to automatically parse JSON data in requests
app.use(cors()); // Enable CORS to allow requests from different domains/origins
app.use(express.urlencoded({ extended: true })); // Tell Express to parse form data in requests
app.use("/api", loginRoutes);
app.use("/api", registerRoutes);// Connect our custom routes to the "/api" path,All routes in registerRoutes will start with "/api"



//all functionality for listing side
// Load data
let listingData = require("./data/listings.json");

// Get all listings
app.get("/listings", (req, res) => {
  res.json(listingData.listings);
});

// Get one listing
app.get("/listings/:id", (req, res) => {
  const listing = listingData.listings.find(l => l.id === req.params.id);
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
  listingData.listings.push(newListing);

  // Save to file
  fs.writeFileSync("./data/listings.json", JSON.stringify(listingData, null, 2));

  res.json({ success: true, listing: newListing });
});

// Delete listing by id
app.delete("/listings/:id", (req, res) => {
  listingData.listings = listingData.listings.filter(l => l.id !== req.params.id);
  fs.writeFileSync("./data/listings.json", JSON.stringify(listingData, null, 2));
  res.json({ success: true });
});

//all functionality for user side

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));