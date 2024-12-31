require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require('axios');
const db = require("./models");

const app = express();
const port = process.env.PORT;
const host = process.env.HOST;

app.use(cors());
app.use(express.json());

app.get("/", function (req, res) {
  res.status(200).json({ message: "home -- Seasoned api" });
});

app.use("/users", require("./routes/users.routes.js"));

app.listen(port, () => console.log(`App listening at http://${host}:${port}/`));
