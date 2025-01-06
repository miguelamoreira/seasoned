const db = require("../models/index.js");
const { ValidationError, Sequelize, where } = require("sequelize");
const axios = require('axios');

const seriesUtil = require("../utils/series.js")

const DroppedSeries = db.DroppedSeries;
const Users = db.Users;
const Series = db.Series;

exports.getDroppedSeries = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const droppedSeries = await DroppedSeries.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Series,
                    as: 'series',
                    attributes: [ 'series_api_id', 'title', 'description', 'release_date', 'genre', 'total_seasons', 'average_rating', 'poster_url', 'creator'],
                },
            ],
        });

        const response = droppedSeries.map((item) => ({
            user_id: item.user_id,
            droppedDate: item.droped_date,
            series: item.series,
        }));

        return res.status(200).json({
            message: 'Dropped series retrieved successfully',
            data: response,
        });
    } catch (error) {
        console.error('Error getting dropped series:', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.'
        })
    }
}

exports.addDroppedSeries = async (req, res) => {
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
        
        const existingDropped = await DroppedSeries.findOne({
            where: { user_id: userId, series_api_id: seriesId },
        });
        if (existingDropped) {
            return res.status(400).json({
                message: 'The user has already dropped this series',
            });
        }

        const newDrop = await DroppedSeries.create({
            user_id: userId,
            series_api_id: seriesId,
        });

        return res.status(200).json({
            message: 'Series added to dropped series list successfully',
            data: newDrop,
        });
    } catch (error) {
        console.error('Error adding dropped series: ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
};
