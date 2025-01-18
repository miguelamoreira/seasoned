const express = require("express");
const router = express.Router();
require("dotenv").config();

const notificationsConfigController = require("../controllers/notificationsConfig.controller")

router.route("/configurations/:id")
    .get(notificationsConfigController.getNotificationsConfigurations)
    .patch(notificationsConfigController.updateNotificationsConfigurations)

module.exports = router;