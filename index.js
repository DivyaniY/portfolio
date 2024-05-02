const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

// MongoDB Atlas connection URI
const mongoURI = "mongodb://localhost:27017//users";

mongoose.connect(mongoURI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

const db = mongoose.connection;
db.on('error', (err) => console.error("Error in database connection:", err));
db.once('open', () => console.log("Connected to Database"));

app.post("/contact_form", async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    const data = {
        name,
        email,
        phone,
        subject,
        message
    };

    try {
        const result = await db.collection('users').insertOne(data);
        console.log("Record Inserted successfully");
        return res.redirect('success.html');
    } catch (error) {
        console.error("Error inserting record:", error);
        return res.status(500).send("Error occurred while saving data");
    }
});

app.get("/", (req, res) => {
    res.set({
        "Allow-acces-Allow-Origin": '*'
    });
    return res.redirect('index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
