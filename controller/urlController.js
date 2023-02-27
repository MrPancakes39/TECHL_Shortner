const Redirect = require("../models/urlModel");
const validator = require("validator");

module.exports.createRedirect = async function (req, res) {
    if (!req.body.shortjson || !req.body.shortjson.code || !req.body.shortjson.original_url) {
        return res.status(400).json({message: "Request body is not in correct format."});
    }

    const { original_url, code } = req.body.shortjson;

    if (!validator.isURL(original_url)) {
        console.log(req.body);
        return res.status(400).json({messgae:"Request body didn't prove a URL."});
    }

    const safe_code = code
        .toString()
        .trim()
        .replace(/[^a-z0-9]/gi, "_");

    const redirect_in_db = await Redirect.findOne({ short_code: safe_code });
    if (redirect_in_db) {
        return res.status(400).json({message: `Code ${safe_code} is already taken.`});
    }
    
    await Redirect.create({
        short_code: safe_code,
        destination_url: original_url
    }, (err) => err ? res.status(500).json({message: err.message }) : null);

    return res.sendStatus(200);
};

module.exports.redirect = async function(req, res) {
    const code = req.params.code.toString();
    const redirect_in_db = await Redirect.findOne({ short_code: code });
    if (!redirect_in_db) {
        return res.status(400).json({message: `Code ${code} is not a valid code.`});
    }
    const {destination_url} = redirect_in_db;
    return res.redirect(destination_url);
}