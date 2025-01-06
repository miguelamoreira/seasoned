const db = require("../models/index.js");
const { ValidationError, Sequelize, where } = require("sequelize");
const axios = require("axios");

const seriesUtil = require("../utils/series.js")

const Users = db.Users;
const Series = db.Series;
const Seasons = db.Seasons;
const Episodes = db.Episodes;
const SeriesLikes = db.SeriesLikes;

exports.getLikedSeries = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await Users.findByPk(userId)
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
            })
        }

        const likedSeries = await SeriesLikes.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Series,
                    as: 'series',
                    attributes: [ 'series_api_id', 'title', 'description', 'release_date', 'genre', 'total_seasons', 'average_rating', 'poster_url', 'creator'],
                },
            ],
        })

        const seriesData = likedSeries.map((like) => like.series);

        return res.status(200).json({
            message: 'Liked series fetched successfully.',
            data: seriesData,
        });
    } catch (error) {
        console.error('Error getting liked series: ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
}

exports.likeSeries = async (req, res) => {
    const userId = req.params.id;
    const { seriesId } = req.body;

    if (!seriesId) {
        return res.status(400).json({
            message: 'Series id is required.'
        });
    }

    try {
        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        const series = await Series.findOne({ where: { series_api_id: seriesId } });
        if (!series) {
            await seriesUtil.addSeriesWithSeasonsAndEpisodes(seriesId);
        }

        const existingLike = await SeriesLikes.findOne({ where: { user_id: userId, series_api_id: seriesId }})
        if (existingLike) {
            return res.status(400).json({
                message: 'You have already liked this series.',
            });
        }

        await SeriesLikes.create({ user_id: userId, series_api_id: seriesId, like_date: new Date()})

        return res.status(201).json({
            message: 'Series liked successfully.',
        });
    } catch (error) {
        console.error('Error liking the series: ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
};

exports.dislikeSeries = async (req, res) => {
    const userId = req.params.id;
    const { seriesId } = req.body;

    if (!seriesId) {
        return res.status(400).json({
            message: 'Series id is required.'
        });
    }

    try {
        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        const series = await Series.findOne({ where: { series_api_id: seriesId } });
        if (!series) {
            return res.status(404).json({
                message: 'Series not found in the database.'
            });
        }

        const existingLike = await SeriesLikes.findOne({
            where: { user_id: userId, series_api_id: seriesId },
        });

        if (!existingLike) {
            return res.status(400).json({
                message: "You haven't liked this series yet.",
            });
        }

        await SeriesLikes.destroy({ where: { user_id: userId, series_api_id: seriesId }})

        return res.status(200).json({
            message: 'Series disliked successfully.',
        });
    } catch (error) {
        console.error('Error disliking the series: ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
}