const db = require("../models/index.js");
const { ValidationError, Sequelize, where } = require("sequelize");

const Users = db.Users;
const Series = db.Series;
const Seasons = db.Seasons;
const Episodes = db.Episodes;
const SeriesLikes = db.SeriesLikes;

exports.getMostPopularSeries = async (req, res) => {
    try {
        const mostLikedSeries = await Series.findAll({
            attributes: {
                include: [
                    [Sequelize.literal('(SELECT COUNT(*) FROM SeriesLikes WHERE SeriesLikes.series_api_id = Series.series_api_id)'), 'likeCount']
                ]
            },
            order: [[Sequelize.literal('likeCount'), 'DESC']],
            limit: 10,
        });

        if (!mostLikedSeries || mostLikedSeries.length === 0) {
            return res.status(404).json({
                message: 'No liked series found.',
            });
        }

        return res.status(200).json({
            message: 'Most liked series fetched successfully.',
            data: mostLikedSeries,
        });
    } catch (error) {
        console.error('Error getting most liked series: ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
};