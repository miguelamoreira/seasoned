const express = require("express");
const router = express.Router();
require("dotenv").config();

// cloudinary
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const usersController = require("../controllers/users.controller");
const badgesController = require("../controllers/badges.controller");
const favouriteSeriesController = require("../controllers/favouriteSeries.controller");
const genresController = require("../controllers/genres.controller");
const followingUsersController = require("../controllers/followingUsers.controller");
const reviewsController = require("../controllers/reviews.controller");
const followedSeriesController = require("../controllers/followedSeries.controller");
const droppedSeriesController = require("../controllers/droppedSeries.controller");
const watchedSeriesController = require("../controllers/watchedSeries.controller");
const watchlistController = require("../controllers/watchlist.controller");
const episodeLikesController = require("../controllers/episodesLikes.controller");
const seriesLikesController = require("../controllers/seriesLikes.controller");
const reviewLikesController = require("../controllers/reviewLike.controller");
const seasonProgressController = require("../controllers/seasonProgress.controller");
const seriesProgressController = require("../controllers/seriesProgress.controller");
const notificationsController = require("../controllers/notifications.controller")

router.route("/login").post(usersController.login);

router.route("/").post(usersController.create).get(usersController.findAll);

router
  .route("/:id")
  .get(usersController.findOne)
  .patch(usersController.updateData)
  .delete(usersController.deleteUser);

router
  .route("/:id/avatar")
  .patch(upload.single("avatar"), usersController.updateAvatar)
  .delete(usersController.deleteAvatar);

router.route("/:id/username").patch(usersController.updateUsername);
router.route("/:id/time").patch(usersController.updateTimeSpent);

router
  .route("/:id/earnedBadges")
  .get(badgesController.findEarnedBadges)
  .post(badgesController.addEarnedBadges);

router
  .route("/:id/seasonProgress")
  .get(seasonProgressController.seasonProgressGet)
  .post(seasonProgressController.seasonProgressPost)

router
  .route("/:id/seriesProgress")
  .get(seriesProgressController.seriesProgressGet)
  .post(seriesProgressController.seriesProgressPost)

router
  .route("/:id/badges")
  .get(badgesController.findBadgesComparison)
  .patch(badgesController.updateBadgesVisibility);

router.route("/:userId/badges/:id").get(badgesController.findBadgeById);

router
  .route("/:id/favourites")
  .get(favouriteSeriesController.findAllFavouriteSeries)
  .post(favouriteSeriesController.addFavouriteSeries)
  .delete(favouriteSeriesController.deleteFavouriteSeries);

router
  .route("/:id/preferredGenres")
  .get(genresController.findGenresComparison)
  .post(genresController.addPreferredGenre)
  .delete(genresController.deletePreferredGenre);

router
  .route("/:id/following")
  .get(followingUsersController.getFollowingUsers)
  .post(followingUsersController.addFollowing);

router.route("/:id/followers").get(followingUsersController.getFollowers);

router
  .route("/:id/relationships")
  .post(followingUsersController.isFollowing)
  .delete(followingUsersController.removeRelationships);

router.route("/:id/ratings").get(reviewsController.getRatingsGroupedByScore);

router
  .route("/:id/followedSeries")
  .get(followedSeriesController.getFollowedSeries)
  .post(followedSeriesController.addFollowedSeries)
  .delete(followedSeriesController.removeFollowedSeries);

router
  .route("/:id/droppedSeries")
  .get(droppedSeriesController.getDroppedSeries)
  .post(droppedSeriesController.addDroppedSeries)
  .delete(droppedSeriesController.removeDroppedSeries);

router
  .route("/:id/watchedSeries")
  .get(watchedSeriesController.getWatchedSeries)
  .post(watchedSeriesController.addWatchedSeries)
  .delete(watchedSeriesController.removeFromWatchedSeries)

router
  .route("/:id/watchlist")
  .get(watchlistController.getWatchlist)
  .post(watchlistController.addToWatchlist)
  .delete(watchlistController.removeFromWatchlist);

router.route("/:id/reviews").get(reviewsController.getReviewsByUserId);

router
  .route("/:id/likes/episodes")
  .get(episodeLikesController.getLikedEpisodes)
  .post(episodeLikesController.likeEpisodes)
  .delete(episodeLikesController.dislikeEpisodes);

router
  .route("/:id/likes/series")
  .get(seriesLikesController.getLikedSeries)
  .post(seriesLikesController.likeSeries)
  .delete(seriesLikesController.dislikeSeries);

router
  .route("/:id/likes/reviews")
  .get(reviewLikesController.getLikedReviews)
  .post(reviewLikesController.likeReviews)
  .delete(reviewLikesController.dislikeReviews);

router
  .route("/:id/viewingHistory")
  .get(usersController.viewingHistoryGet)
  .post(usersController.viewingHistoryPost)
  .delete(usersController.viewingHistoryDelete)

router
  .route("/:id/continueWatching")
  .get(usersController.getContinueWatching)

router
  .route("/:id/notifications")
  .get(notificationsController.getNotificationsByUserId)

module.exports = router;
