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
const mongoURI = "mongodb+srv://divyani21beitv125:n6LSg9OSRBqiqqxI@users.djfqkmn.mongodb.net/users";

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', () => console.log("Error in connecting to database"));
db.once('open', () => console.log("Connected to Database"));

app.post("/contact_form", (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    const data = {
        name,
        email,
        phone,
        subject,
        message
    };

    db.collection('users').insertOne(data, (err, collection) => {
        if (err) {
            throw err;
        }
        console.log("Record Inserted successfully");
    });

    return res.redirect('success.html');
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
