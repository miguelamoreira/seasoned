const db = require("../models/index.js");
const { ValidationError, Sequelize, where } = require("sequelize");
const axios = require("axios");

const Users = db.Users;
const Series = db.Series;
const Reviews = db.Reviews;

exports.getRatingsGroupedByScore = async (req, res) => {
    const userId = req.params.id;

    try {   
        const ratings = await Reviews.findAll({ where: { user_id: userId }, attributes: ['score'] })

        const groupedRatings = [1, 2, 3, 4, 5].reduce((acc, score) => {
            acc[score] = ratings.filter(rating => rating.score === score).length;
            return acc;
        }, {})

        return res.status(200).json({
            message: 'Ratings grouped by score retrieved successfully',
            data: groupedRatings
        })
    } catch (error) {
        console.error('Error getting ratings grouped by score: ', error)
        return res.status(500).json({
            message: 'Something went wrong. Please try again later'
        })
    }
}