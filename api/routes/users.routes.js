const express = require("express");
const router = express.Router();
require("dotenv").config();

// cloudinary
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const usersController = require("../controllers/users.controller");

router.route("/login")
    .post(usersController.login);

router.route("/")
    .post(usersController.create)

router.route("/:id")
    .get(usersController.findOne)

module.exports = router;