const db = require("../models/index.js");
const { ValidationError, Sequelize, where } = require("sequelize");
const axios = require('axios');

const Watchlist = db.Watchlist;
const Users = db.Users;
const Series = db.Series;

exports.getWatchlist = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        const watchlist = await Watchlist.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Series,
                    as: 'series',
                    attributes: [ 'series_api_id', 'title', 'description', 'release_date', 'genre', 'total_seasons', 'average_rating', 'poster_url'],
                },
            ],
        });

        const response = watchlist.map((item) => ({
            user_id: item.user_id,
            series: item.series,
        }));

        return res.status(200).json({
            message: 'Watchlist retrieved successfully',
            data: response,
        });
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
};

exports.addToWatchlist = async (req, res) => {
    const userId = req.params.id;
    const { seriesId } = req.body;

    if (!seriesId) {
        return res.status(400).json({
            message: 'Series ID is required.',
        });
    }

    try {
        let series = await Series.findOne({ where: { series_api_id: seriesId } });

        if (!series) {
            const apiResponse = await axios.get(`https://api.tvmaze.com/shows/${seriesId}?embed=seasons`);
            const apiData = apiResponse.data;

            const totalSeasons = apiData._embedded?.seasons.length || 0;

            series = await Series.create({
                series_api_id: apiData.id,
                title: apiData.name,
                description: apiData.summary?.replace(/<\/?[^>]+(>|$)/g, ""),
                release_date: apiData.premiered,
                genre: apiData.genres.join(', '),
                total_seasons: totalSeasons,
                average_rating: apiData.rating?.average || null,
                poster_url: apiData.image?.original || null,
            });
        }

        const existingWatchlistEntry = await Watchlist.findOne({
            where: { user_id: userId, series_api_id: seriesId },
        });

        if (existingWatchlistEntry) {
            return res.status(400).json({
                message: 'This series is already in the user’s watchlist.',
            });
        }

        const newWatchlistEntry = await Watchlist.create({
            user_id: userId,
            series_api_id: seriesId,
        });

        return res.status(201).json({
            message: 'Series added to watchlist successfully.',
            data: newWatchlistEntry,
        });
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
};
