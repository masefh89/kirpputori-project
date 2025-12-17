const express = require("express"); // Load Express to create a web server
const cors = require("cors"); // Load CORS to allow cross-origin requests
const fs = require("fs"); // Load File System module for reading/writing files

const registerRoutes = require("./routes/register.routes"); // Import register route handlers
const loginRoutes = require("./routes/login.routes"); // Import login route handlers

const app = express(); // Create Express application
const PORT = 3001; // Port where the server will listen

// ---------------- MIDDLEWARE ----------------
app.use(express.json()); // Automatically parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(cors({ // Enable CORS for all origins and common methods
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

// Debug logging for all incoming requests
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// ---------------- ROUTES ----------------
// Connect login and register routes to "/api"
// login.routes.js → /api/login
// register.routes.js → /api/register
app.use("/api", loginRoutes);
app.use("/api", registerRoutes);

// ---------------- DATA HANDLING ----------------
const DATA_PATH = "./data/data.json"; // Path to JSON file storing listings

// Function to load listings from file
function loadListings() {
  // Read JSON file synchronously and parse into JS object
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
}

// Function to save listings back to file
function saveListings(data) {
  // Convert JS object to JSON string and write to file
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// ---------------- LISTING ROUTES ----------------

// Get all listings
app.get("/listings", (req, res) => {
  const data = loadListings(); // Load data from file
  res.json(data.listings); // Send array of listings
});

// Get recently added listings (latest 6)
app.get("/listings/recent", (req, res) => {
  const data = loadListings(); // Load data

  // Parse dates for proper sorting
  const listingsWithParsedDates = data.listings.map(item => {
    let parsedDate = new Date(item.date);

    // If parsing fails, try manual parsing for DD/MM/YYYY format
    if (isNaN(parsedDate)) {
      const [day, month, year] = item.date.split(',')[0].trim().split('/');
      parsedDate = new Date(`${year}-${month}-${day}T00:00:00`);
    }

    return { ...item, parsedDate }; // Add parsedDate for sorting
  });

  // Sort by date descending and take first 6
  const recentListings = listingsWithParsedDates
    .sort((a, b) => b.parsedDate - a.parsedDate)
    .slice(0, 6)
    .map(({ parsedDate, ...rest }) => rest); // Remove parsedDate before sending

  res.json(recentListings);
});

// Get one listing by ID
app.get("/listings/:id", (req, res) => {
  const data = loadListings();
  const listing = data.listings.find(l => l.id === req.params.id); // Find by ID

  // If listing exists, send it, otherwise send 404
  listing ? res.json(listing) : res.status(404).json({ success: false, message: "Not found" });
});

// Create a new listing
app.post("/listings", (req, res) => {
  const data = loadListings();

  // Get current date/time formatted for display
  const now = new Date();
  const published = now.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  // Compile new listing object
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

  data.listings.push(newListing); // Add to array
  saveListings(data); // Save to file

  res.json({ success: true, listing: newListing }); // Respond with new listing
});

// Update an existing listing
app.put("/listings/:id", (req, res) => {
  console.log("PUT called with ID:", req.params.id);

  const data = loadListings();
  const listing = data.listings.find(l => l.id === req.params.id);

  // If listing does not exist, send 404
  if (!listing) {
    console.log("Listing not found!");
    return res.status(404).json({ success: false, message: "Listing not found" });
  }

  // Define editable fields
  const editableFields = [
    "title", "briefDescription", "description",
    "price", "category", "type", "location"
  ];

  // Update fields if present in request body
  editableFields.forEach(field => {
    if (req.body[field] !== undefined) {
      listing[field] = req.body[field];
    }
  });

  saveListings(data); // Save changes to file

  res.json({ success: true, listing }); // Respond with updated listing
});

// Delete a listing by ID
app.delete("/listings/:id", (req, res) => {
  const data = loadListings();
  data.listings = data.listings.filter(l => l.id !== req.params.id); // Remove listing
  saveListings(data); // Save changes
  res.json({ success: true });
});

// ---------------- SERVER START ----------------
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));