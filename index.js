const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Atlas connection URI
const mongoURI = "mongodb+srv://divyani21beitv125:n6LSg9OSRBqiqqxI@users.djfqkmn.mongodb.net/users";

mongoose.connect(mongoURI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true // Ensure index creation
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the application if connection fails
});

const db = mongoose.connection;
db.on('error', (err) => console.error("Error in database connection:", err));
db.once('open', () => console.log("Connected to Database"));

// Define a Mongoose schema for the user data
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    subject: String,
    message: String
});

// Define a Mongoose model based on the schema
const User = mongoose.model('User', userSchema);

app.post("/contact_form", async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    // Create a new user document
    const newUser = new User({ name, email, phone, subject, message });

    try {
        // Save the new user document to the database
        await newUser.save();
        console.log("Record Inserted successfully");
        return res.sendFile(path.join(__dirname, '/public/success.html'));
    } catch (error) {
        console.error("Error inserting record:", error);
        return res.status(500).send("Error occurred while saving data");
    }
});

app.get("/", (req, res) => {
    res.set({
        "Allow-acces-Allow-Origin": '*'
    });
    return res.sendFile(path.join(__dirname, '/public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
