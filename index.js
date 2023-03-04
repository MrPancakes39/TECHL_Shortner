// Setup enviroment variables
require("dotenv").config();

// All imports
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const redirect = require("./routers/redirect");

// Connect to database
mongoose.set("strictQuery", false);
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB Connected!"))
    .catch((err) => {
        console.error(err);
        console.error("Can't connect to MongoDB Database.");
        process.exit(1);
    });

// Create express app
const app = express();

app.use(express.json());
app.use("/api/", redirect);
app.use("/", express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on http://127.0.0.1:${PORT}.`));

module.exports = app;
