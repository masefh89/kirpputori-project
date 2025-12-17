const express = require("express"); // Load the Express library to create a web server

const cors = require("cors"); // Load the CORS library to handle cross-origin requests---Needed because frontend runs on a different port.

const fs = require("fs"); // Load the File System library to work with files----------Used for writing to data.json.
const registerRoutes = require("./routes/register.routes"); // register routes
const loginRoutes = require("./routes/login.routes");// login route



const app = express(); // Create an Express application (our web server)
const PORT = 3001;// Define the port number where our server will listen

app.use(express.json()); // Tell Express to automatically parse JSON data in requests ---Required for POST requests.
app.use(cors()); // Enable CORS to allow requests from different domains/origins
app.use(express.urlencoded({ extended: true })); // Tell Express to parse form data in requests


// ---------------- ROUTES ----------------
// Connect login and register routes to "/api"
// Example:
// login.routes.js → /api/login
// register.routes.js → /api/register

app.use("/api", loginRoutes);
app.use("/api", registerRoutes);// Connect our custom routes to the "/api" path,All routes in registerRoutes will start with "/api"

// reads the json file and converts the data from string to javascript object and return the data to server to be used
function loadData() {
  return JSON.parse(fs.readFileSync("./data/data.json", "utf-8"));
  // fs.readFileSync  => Synchronously reads the contents of a file
  // "utf-8"  => Specifies the text encoding so the file is read as a string
  // JSON.parse => Converts a JSON-formatted string into a JavaScript objec
};

// Get all listings
app.get("/listings", (req, res) => {
  const data = loadData();
  res.json(data.listings);
});
// Get recently added listings (latest 6)
app.get("/listings/recent", (req, res) => {
  const data = loadData();

  // Map each item to include a proper JS Date object for sorting
  const listingsWithParsedDates = data.listings.map(item => {
    let parsedDate = new Date(item.date);
    
    // If parsing fails (Invalid Date), try manual parsing for DD/MM/YYYY format
    if (isNaN(parsedDate)) {
      const [day, month, year] = item.date.split(',')[0].trim().split('/');
      parsedDate = new Date(`${year}-${month}-${day}T00:00:00`);
    }

    return { ...item, parsedDate };
  });

  // Sort by date descending (newest first) and take the first 6 items
  const recentListings = listingsWithParsedDates
    .sort((a, b) => b.parsedDate - a.parsedDate)
    .slice(0, 6)
    .map(({ parsedDate, ...rest }) => rest); // Remove the parsedDate before sending

  res.json(recentListings);
});

// Get one listing by ID 
app.get("/listings/:id", (req, res) => {
  const data = loadData();
  const listing = data.listings.find(l => l.id === req.params.id);// If listing exists, send it, otherwise send 404 error
  listing ? res.json(listing) : res.status(404).send("Not found");
});




// Create listing
app.post("/listings", (req, res) => {
  const data = loadData();
  const favorites = []

  // Get current date and time
  const now = new Date();
  // Format date in readable way
  const published = now.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  // Compile all listing data into one object
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

  // Save updated data back to data.json file
  fs.writeFileSync("./data/data.json", JSON.stringify(data, null, 2));
  // Send success response back to frontend
  res.json({ success: true, listing: newListing });
});

// Delete a listing by ID
app.delete("/listings/:id", (req, res) => {
  const data = loadData();
  // Remove listing with matching ID
  data.listings = data.listings.filter(l => l.id !== req.params.id);
  // Save updated data back to file
  fs.writeFileSync("./data/data.json", JSON.stringify(data, null, 2));
  res.json({ success: true });
});
// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));