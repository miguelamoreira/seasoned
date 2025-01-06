const express = require("express");
const router = express.Router();
require("dotenv").config();

const reviewsController = require("../controllers/reviews.controller");
const reviewCommentsController = require("../controllers/reviewComments.controller")

router.route("/")
    .get(reviewsController.getReviews)
    .post(reviewsController.createReviews)

router.route("/:id")
    .get(reviewsController.getReviewById)

router.route("/:id/comments")
    .get(reviewCommentsController.getCommentsByReviewId)
    .post(reviewCommentsController.addCommentToReview)

module.exports = router;