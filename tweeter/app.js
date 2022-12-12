const express = require("express");
const app = express();
var db = require("./db");

app.use("/login/", require("./routes/loginRoutes"));

app.get("/", function(req, res) {
    res.send("Express here");
});

app.post("/", function(req, res) {
    res.send(req);
    console.log(req);
});

db.connect(db.MODE_PRODUCTION, function(err) {
    if (err) {
        console.log("Unable to connect to MySQL.");
        process.exit(1);
    } else {
        app.listen(3001, function() {
            console.log("Listening on port 3001...");
        });
    }
});