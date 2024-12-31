const express = require("express");
const router = express.Router();
require("dotenv").config();

const genresController = require("../controllers/genres.controller")

router.route("/")
    .get(genresController.findAllGenres)

module.exports = router;