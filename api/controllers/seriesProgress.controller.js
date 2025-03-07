const db = require("../models/index.js");
const { ValidationError, Sequelize, where, Op } = require("sequelize");

const Users = db.Users;
const SeriesProgress = db.SeriesProgress;
exports.seriesProgressGet = async (req, res) => {
  let SeriesProgressUsers = await SeriesProgress.findAll({
    where: {
      user_id: req.params.id,
    },
  });

  if (SeriesProgressUsers.length != 0) return res.json(SeriesProgressUsers);

  return res.status(200).json(
    []);
};

exports.seriesProgressPost = async (req, res) => {
  let SeriesProgressUser = await SeriesProgress.findOne({
    where: {
      user_id: req.params.id,
      series_id: req.body.series_id,
    },
  });

  if (SeriesProgressUser){
    try {
      let update = await SeriesProgress.update(req.body, {
        where: {
          user_id: req.params.id,
          series_id: req.body.series_id,
        },
      });
    } catch (error) {
      return res.status(400).json({
        error: "Error Updating series",
      });
    }
  
    return res.status(201).json("Series Progress updated succesully");
  }
    

  let New = await SeriesProgress.create({
    user_id: req.params.id,
    series_id: req.body.series_id,
    progress_percentage: req.body.progress_percentage,
  });

  return res.status(201).json("Series Progress created successfully");
};


