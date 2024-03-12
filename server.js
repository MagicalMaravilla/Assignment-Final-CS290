// Import the required modules
const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

// Initialize an Express application
const app = express();
const PORT = 3001;

// Middleware to serve static files and parse request bodies
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// USERS_FILE is the path to the JSON file where user data will be stored
const USERS_FILE = path.join(__dirname, 'users.json');

// Function to read users from the file
function readUsersFromFile(callback) {
    fs.readFile(USERS_FILE, (err, data) => {
        if (err || !data) {
            console.log("Could not read users file or file is empty, initializing with empty array.");
            writeUsersToFile([], () => {}); // Initialize file with empty array
            return callback([]);
        }
        try {
            const users = JSON.parse(data);
            callback(users);
        } catch (error) {
            console.error("Error parsing users file, initializing with empty array:", error);
            writeUsersToFile([], () => {}); // Initialize file with empty array on parse error
            callback([]);
        }
    });
}

// Function to write users to the file
function writeUsersToFile(users, callback) {
    fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), err => {
        callback(err);
    });
}

// Route handler for the root URL ("/")
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'recipe_home_page.html'));
});

// Endpoint for handling account creation
app.post('/create-account', async (req, res) => {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).send('All fields are required.');
    }

    readUsersFromFile(async (users) => {
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).send('User already exists with the given email.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ username, email, password: hashedPassword });
        
        writeUsersToFile(users, err => {
            if (err) {
                console.error("Error writing to users file:", err);
                return res.status(500).send('Error creating account.');
            }
            res.status(201).send('Account created successfully.');
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
