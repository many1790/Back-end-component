const express = require("express");
const { getAllUser } = require("../controllers/usersControlers");
const router = express.Router();

router.get("/", getAllUser)

module.exports= { router }