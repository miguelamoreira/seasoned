const express = require("express");
const router = express.Router();
require("dotenv").config();

const reviewsController = require("../controllers/reviews.controller")
const seriesController = require("../controllers/series.controller")
const episodesController = require("../controllers/episodes.controller")

router.route("/popular")
    .get(seriesController.getMostPopularSeries)

router.route("/:id")
    .get(seriesController.findSeriesById)

router.route("/:id/episodes")
    .get(episodesController.findEpisodesBySeries)

router.route("/:id/seriesprogress")
    .get(seriesController.findSeriesById)

router.route("/:id/reviews")
    .get(reviewsController.getReviewsBySeriesId)

module.exports = router;