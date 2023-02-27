const {Router} = require("express");
const router = Router();
const urlController = require("../controller/urlController");

router.post("/create", urlController.createRedirect);

module.exports = router;