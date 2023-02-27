const mongoose = require("mongoose");
const { Schema } = mongoose;

const urlSchema = new Schema({
    short_code: {
        type: String,
        unique: true
    },
    destination_url: String
});

module.exports = mongoose.model('URL', urlSchema);