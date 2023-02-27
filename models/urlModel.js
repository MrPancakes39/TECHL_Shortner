const mongoose = require("mongoose");
const { Schema } = mongoose;

const urlSchema = new Schema({
    short_url: String,
    destination_url: String
});

module.exports = mongoose.model('URL', urlSchema);