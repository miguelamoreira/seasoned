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

router.route("/login")
    .post(usersController.login);

router.route("/")
    .post(usersController.create)

router.route("/:id")
    .get(usersController.findOne)
    .patch(usersController.update)

router.route("/:id/avatar")
    .patch(upload.single('avatar'), usersController.updateAvatar)

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
    .get(genresController.findAllPreferredGenres)
    .post(genresController.addPreferredGenre)
    .delete(genresController.deletePreferredGenre)

module.exports = router;