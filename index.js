require("dotenv").config();

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on http://127.0.0.1:${PORT}.`));

app.get("/", (req, res) => {
    res.send("Hello Shortner");
});