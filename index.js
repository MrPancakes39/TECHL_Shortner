// Setup enviroment variables
require("dotenv").config();

// Connect to database
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL).then(() => console.log("MongoDB Connected!")).catch((err) => {
    console.error(err);
    console.error("Can't connect to MongoDB Database.");
    process.exit(1);
})

// Create express app
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on http://127.0.0.1:${PORT}.`));

app.get("/", (req, res) => {
    res.send("Hello Shortner");
});