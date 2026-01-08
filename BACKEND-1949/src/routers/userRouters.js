const express = require("express");
const { getAllUser } = require("../controlers/usersControlers");
const router = express.Router();

router.get("/", getAllUser)

module.exports= { router }