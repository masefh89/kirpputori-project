/*
  login.handler.js
  ----------------
  Handles user login logic:
  - read users from users.json
  - check email & password
*/

const fs = require("fs"); // "fs" is built in Node.js modules that lets the code read/write files(for example reaidng user.json)
const path = require("path");// "path" helps to build file pahts correctly
//---------------------------------------------------------------------------
// path to users.json
const usersFilePath = path.join(__dirname, "../data/users.json");
//__dirname: it is an special variable that means "current folder location"
//".." : go to parrent folder 
// "data" : go to data folder
// and finaly the targeted file "users.json"
//-------------------------------------------------------------------


//the main function that handels the process
// "req" : contines data sent to the server like(email, password ) from loginform
// "res" : it will send a response(data) back to the user 
const loginUser = (req, res) => {
    //req is the request object that the Express.js/web framwork has made it
    //.body is a property that holds data submitted in the request body
    // we are taking the email and password properties from req.body
    const email = req.body.email;
    const password = req.body.password; // const{email, password} = req.body;

    // basic validation
    if (!email || !password) {
    return res.status(400).json({ //res.status(400): Sends HTTP status 400 (Bad Request - client error)
        message: "Email and password are required"
    });
    }

    // read users file
    fs.readFile(usersFilePath, "utf-8", (err, data) => {
    if (err) {
        return res.status(500).json({
        message: "Server error"
        });
    }

    const users = JSON.parse(data);//json.parse converts json text into real javascript data
    
    // 1. Reads the JSON string
    // 2. Checks if it's valid JSON
    // 3. Converts JSON syntax to JavaScript values
    // 4. Returns actual JavaScript array/object



    // find user
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(401).json({
        message: "Invalid email or password"
        });
    }

    //password is plain text FOR NOW
    // we can also compare hashed passwords
    if (user.password !== password) {
        return res.status(401).json({
        message: "Invalid email or password"
        });
    }

    // success
    res.status(200).json({
        message: "Login successful",
        user: {
        email: user.email,
        name: user.name
      }
    });
  });
};

module.exports = {
  loginUser
};
