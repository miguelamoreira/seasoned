const express = require("express");
const router = express.Router();
require("dotenv").config();

// cloudinary
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const usersController = require("../controllers/users.controller");
const badgesController = require("../controllers/badges.controller")
const favouriteSeriesController = require("../controllers/favouriteSeries.controller")
const genresController = require("../controllers/genres.controller")
const followingUsersController = require("../controllers/followingUsers.controller")
const reviewsController = require("../controllers/reviews.controller")
const followedSeriesController = require("../controllers/followedSeries.controller")
const droppedSeriesController = require("../controllers/droppedSeries.controller")
const watchedSeriesController = require("../controllers/watchedSeries.controller")
const watchlistController = require("../controllers/watchlist.controller")

router.route("/login")
    .post(usersController.login);

router.route("/")
    .post(usersController.create)

router.route("/:id")
    .get(usersController.findOne)
    .patch(usersController.updateData)
    .delete(usersController.deleteUser)

router.route("/:id/avatar")
    .patch(upload.single('avatar'), usersController.updateAvatar)
    .delete(usersController.deleteAvatar)

router.route("/:id/username")
    .patch(usersController.updateUsername)

router.route("/:id/earnedBadges")
    .get(badgesController.findEarnedBadges)
    .post(badgesController.addEarnedBadges)

router.route("/:id/badges")
    .get(badgesController.findBadgesComparison)
    .patch(badgesController.updateBadgesVisibility)

router.route("/:userId/badges/:id")
    .get(badgesController.findBadgeById)

router.route("/:id/favourites")
    .get(favouriteSeriesController.findAllFavouriteSeries)
    .post(favouriteSeriesController.addFavouriteSeries)
    .delete(favouriteSeriesController.deleteFavouriteSeries)

router.route("/:id/preferredGenres")
    .get(genresController.findGenresComparison)
    .post(genresController.addPreferredGenre)
    .delete(genresController.deletePreferredGenre)

router.route("/:id/following")
    .get(followingUsersController.getFollowingUsers)
    .post(followingUsersController.addFollowing)

router.route("/:id/followers")
    .get(followingUsersController.getFollowers)

router.route("/:id/relationships")
    .post(followingUsersController.isFollowing)
    .delete(followingUsersController.removeRelationships)

router.route("/:id/ratings")
    .get(reviewsController.getRatingsGroupedByScore)

router.route("/:id/followedSeries")
    .get(followedSeriesController.getFollowedSeries)
    .post(followedSeriesController.addFollowedSeries)

router.route("/:id/droppedSeries")
    .get(droppedSeriesController.getDroppedSeries)
    .post(droppedSeriesController.addDroppedSeries)

router.route("/:id/watchedSeries")
    .get(watchedSeriesController.getWatchedSeries)
    .post(watchedSeriesController.addWatchedSeries)

router.route("/:id/watchlist")
    .get(watchlistController.getWatchlist)
    .post(watchlistController.addToWatchlist)

router.route("/:id/reviews")
    .get(reviewsController.getReviewsByUserId)
    
module.exports = router;