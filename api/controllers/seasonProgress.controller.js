const db = require("../models/index.js");
const { ValidationError, Sequelize, where, Op } = require("sequelize");

const Users = db.Users;
const SeasonProgress = db.SeasonProgress;
exports.seasonProgressGet = async (req, res) => {
  let SeasonProgressUsers = await SeasonProgress.findAll({
    where: {
      user_id: req.params.id,
    },
  });

  if (SeasonProgressUsers.length != 0) return res.json(SeasonProgressUsers);

  return res.status(200).json(
    []);
};

exports.seasonProgressPost = async (req, res) => {
  let SeasonProgressUser = await SeasonProgress.findOne({
    where: {
      user_id: req.params.id,
      season_id: req.body.season_id,
    },
  });

  if (SeasonProgressUser){
    try {
      let update = await SeasonProgress.update(req.body, {
        where: {
          user_id: req.params.id,
          season_id: req.body.season_id,
        },
      });
    } catch (error) {
      return res.status(400).json({
        error: "Error updating season",
      });
    }
  
    return res.status(201).json("Season Progress updated succesully");
  }
    

  let New = await SeasonProgress.create({
    user_id: req.params.id,
    season_id: req.body.season_id,
    progress_percentage: req.body.progress_percentage,
  });

  return res.status(201).json("Season Progress created successfully");
};

