const express = require("express");
const router = express.Router();
require("dotenv").config();

// cloudinary
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const usersController = require("../controllers/users.controller");
const badgesController = require("../controllers/badges.controller")

router.route("/login")
    .post(usersController.login);

router.route("/")
    .post(usersController.create)

router.route("/:id")
    .get(usersController.findOne)

router.route("/:id/earnedBadges")
    .get(badgesController.findEarnedBadges)
    .post(badgesController.addEarnedBadges)

router.route("/:id/badges")
    .get(badgesController.findBadgesComparison)
    .patch(badgesController.updateBadgesVisibility)

router.route("/:userId/badges/:id")
    .get(badgesController.findBadgeById)

module.exports = router;