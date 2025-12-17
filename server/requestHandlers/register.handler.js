/* This file has the logic for the registration page 
   It handles the form submission and input validation
*/

// fs (File System) is a built-in Node.js module
const fs = require("fs");

// path helps work with file paths
const path = require("path");

// Path to the single data.json file (contains both listings and users)
const dataFilePath = path.join(__dirname, "../data/data.json");

// Function to read the full data from the JSON file
function readDataFile() {
    const data = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(data); // returns an object like { listings: [...], users: [...] }
}

// Function to save the full data back to JSON file
function saveDataToFile(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// Function to handle user registration
exports.registerUser = (req, res) => {
    const { fullname, email, password } = req.body;

    // Validate required fields
    if (!fullname || !email || !password) {
        return res.status(400).json({
            message: "Please fill all the fields with correct data.",
        });
    }

    // Read the full data (listings + users)
    const data = readDataFile();

    // Check if a user with the same email already exists
    const existingUser = data.users.find(user => user.email === email);
    if (existingUser) {
        return res.status(409).json({
            message: "A user with this email already exists, please use a different email.",
        });
    }

    // Create a new user object
    const newUser = {
        id: Date.now().toString(),
        fullname,
        email,
        password, // Later, consider hashing this
    };

    // Add the new user to the users array
    data.users.push(newUser);

    // Save the updated data (both listings and users) back to the file
    saveDataToFile(data);

    // Return success response
    res.status(201).json({
        message: "User registered successfully!",
        user: {
            id: newUser.id,
            fullname: newUser.fullname,
            email: newUser.email,
        },
    });
};
