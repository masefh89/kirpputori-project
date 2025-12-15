/* this file has the logic for the registration page 
    It handles the form submission, input validation,
*/

// fs (File System) is a built-in Node.js module
// used to read from and write to files on the server
const fs = require("fs");

// Load the 'path' tool that comes with Node.js
// It helps you work with file and folder locations
const path = require("path");


//path to the data.json file(that has the user data)
const usersFilePath = path.join(__dirname, "../data/users.json");

//function to read users from the JSON file

function readUsersFile() {
    // Read the users file and get its contents as text
    const data = fs.readFileSync(usersFilePath, "utf-8");

    // Convert the text data into a JavaScript object and return it
    return JSON.parse(data);
  
}


//function to write users to the JSON file
//and save the new user data

function saveUsersToFile(users) {
    // Write the users object to a file as formatted JSON
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}


//function to handle user registration
exports.registerUser = (req, res) => {
    //we get the fullname, email and password from frontend
    const { fullname, email, password } = req.body;

    //if any field is missing, return an error
    if (!fullname || !email || !password) {
        //400 Bad Request
        //if the status is 400, it means the client sent invalid data or something is missing
        return res.status(400).json({
            message: "Please fill all the fields with correct data.",
        });
    }
    //read existing users from the file
    const users = readUsersFile();

    //check if a user with the same email already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        //409 Conflict
        //if the status is 409, it means there is a conflict with existing data
        return res.status(409).json({
            message: "A user with this email already exists, please use a different email.",
        });
    }
    //create a new user object
    const newUser = {
        id: Date.now().toString(), //generate a simple unique id based on timestamp
        fullname,
        email,
        password, //for future we should hash the password
    };  

    //add the new user to the users array and save to file
    users.push(newUser);
    saveUsersToFile(users);

    //return a success response
    res.status(201).json({
        message: "User registered successfully!",
        user: {
            id: newUser.id,
            fullname: newUser.fullname,
            email: newUser.email,
        },
    }); 

};



    

