const db = require("../models/index.js");
const { ValidationError, Sequelize, where } = require("sequelize");
const axios = require('axios');

const seriesUtil = require("../utils/series.js")

const WatchedSeries = db.WatchedSeries;
const Users = db.Users;
const Series = db.Series;

exports.getWatchedSeries = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const watchedSeries = await WatchedSeries.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Series,
                    as: 'series',
                    attributes: [ 'series_api_id', 'title', 'description', 'release_date', 'genre', 'total_seasons', 'average_rating', 'poster_url', 'creator'],
                },
            ],
        });

        const response = watchedSeries.map((item) => ({
            user_id: item.user_id,
            watchedDate: item.watched_date,
            series: item.series,
        }));

        return res.status(200).json({
            message: 'Watched series retrieved successfully',
            data: response,
        });
    } catch (error) {
        console.error('Error getting watched series:', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.'
        })
    }
}

exports.addWatchedSeries = async (req, res) => {
    const userId = req.params.id;
    const { seriesId } = req.body;

    if (!seriesId) {
        return res.status(400).json({
            message: 'Series ID is required.',
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

        const existingWatch = await WatchedSeries.findOne({
            where: { user_id: userId, series_api_id: seriesId },
        });
        if (existingWatch) {
            return res.status(400).json({
                message: 'The user has already watched this series',
            });
        }

        const newWatch = await WatchedSeries.create({
            user_id: userId,
            series_api_id: seriesId,
        });

        return res.status(200).json({
            message: 'Series added to watched series list successfully',
            data: newWatch,
        });
    } catch (error) {
        console.error('Error adding watched series: ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
};

exports.removeFromWatchedSeries = async (req, res) => {
    const userId = req.params.id;
    const { seriesId } = req.body;

    if (!seriesId) {
        return res.status(400).json({
            message: 'Series ID is required.',
        });
    }

    try {
        const existingWatchedEntry = await WatchedSeries.findOne({
            where: { user_id: userId, series_api_id: seriesId },
        });

        if (!existingWatchedEntry) {
            return res.status(404).json({
                message: 'This series is not in the user’s watchlist.',
            });
        }

        await existingWatchedEntry.destroy();

        return res.status(200).json({
            message: 'Series removed from watched series successfully.',
        });
    } catch (error) {
        console.error('Error removing from watched series:', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
};