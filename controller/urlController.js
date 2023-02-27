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
        
    const short_url = `${req.protocol}//${req.get("host")}/${safe_code}`;
    
    const redirect_in_db = await Redirect.findOne({ short_url });
    if (redirect_in_db) {
        return res.status(400).json({message: `Code ${safe_code} is already taken.`});
    }
    
    await Redirect.create({
        short_url,
        destination_url: original_url
    }, (err) => err ? res.status(500).json({message: err.message }) : null);

    return res.sendStatus(200);
};
