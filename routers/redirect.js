const {Router} = require("express");
const router = Router();
const urlController = require("../controller/urlController");

router.post("/create", urlController.createRedirect);
router.get("/redirect/:code", urlController.redirect);

module.exports = router;