var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

// Hardcoded MongoDB connection URI
const mongoURI = "mongodb://localhost:27017/users";

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;
db.on('error', () => console.log("Error in connecting to database"));
db.once('open', () => console.log("Connected to Database"));

app.post("/contact_form", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var subject = req.body.subject;
    var message = req.body.message;

    var data = {
        "name": name,
        "email": email,
        "phone": phone,
        "subject": subject,
        "message": message
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
}).listen(3000);

console.log("Listening on port 3000");
