const express = require("express");
const router = express.Router();
require("dotenv").config();

const badgesController = require('../controllers/badges.controller');

router.route('/')
    .get(badgesController.findAllBadges)

module.exports = router;