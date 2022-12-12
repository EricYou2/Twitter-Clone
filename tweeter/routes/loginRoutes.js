const express = require("express");
router = express.Router();

loginRoute = require("../controllers/loginController");

router.get("/", loginRoute.loginController);

router.get("")

module.exports = router;