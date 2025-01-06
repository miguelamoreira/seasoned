const express = require("express");
const router = express.Router();
require("dotenv").config();

const reviewsController = require("../controllers/reviews.controller")

router.route("/:id/reviews")
    .get(reviewsController.getReviewsBySeriesId)

module.exports = router;