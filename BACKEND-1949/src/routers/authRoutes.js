const express = require("express");
const { register } = require("../controlers/authController.js");

const router = express.Router();

router.post("/register", register);

module.exports = router;
