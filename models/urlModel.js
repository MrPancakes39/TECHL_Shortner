const {Schema} = require("mongoose");

const urlSchema = new Schema({
    short_url: String,
    destination_url: String
});

module.exports = mongoose.model('URL', urlSchema);