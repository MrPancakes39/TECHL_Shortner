// Setup enviroment variables
require("dotenv").config();

// All imports
const mongoose = require("mongoose");
const express = require("express");
const helmet = require("helmet");
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

app.use(express.json()); // Middleware for parsing JSON requests.
app.use("/api/", redirect); // Use redirect router on /api/ endpoint.
app.use("/", express.static(path.join(__dirname, "public"))); // Middleware to serve the static webpage files.
app.use(helmet()); // Helmet helps you secure your Express apps by setting various HTTP headers.

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on http://127.0.0.1:${PORT}.`));

module.exports = app;
