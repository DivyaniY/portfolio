const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));


mongoose.connect('mongodb://localhost:27017/users'); 
const db = mongoose.connection;
db.on('error', () => console.error("Error connecting to database"));
db.once('open', () => console.log("Connected to Database"));

app.post("/contact_form", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const subject = req.body.subject;
    const message = req.body.message;

    const data = {
        "name": name,
        "email": email,
        "phone": phone,
        "subject": subject,
        "message": message
    };

    db.collection('users').insertOne(data, (err, collection) => {
        if (err) {
            console.error("Error inserting record:", err);
            return res.status(500).send("Error occurred while saving data");
        }
        console.log("Record Inserted successfully");
        return res.redirect('success.html');
    });
});

app.get("/", (req, res) => {
    res.set({
        "Access-Control-Allow-Origin": '*'
    });
    return res.redirect('index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
