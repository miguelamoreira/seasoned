const express = require("express");
const router = express.Router();
require("dotenv").config();

const reviewsController = require("../controllers/reviews.controller");

router.route("/")
    .get(reviewsController.getReviews)
    .post(reviewsController.createReviews)

router.route("/:id")
    .get(reviewsController.getReviewById)

module.exports = router;