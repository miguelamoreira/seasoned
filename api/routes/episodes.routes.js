const express = require("express");
const router = express.Router();
require("dotenv").config();

const reviewsController = require("../controllers/reviews.controller")
const episodesController = require("../controllers/episodes.controller")

router.route("/:id")
    .get(episodesController.findEpisodeById)

router.route("/:id/reviews")
    .get(reviewsController.getReviewsByEpisodeId)

module.exports = router;