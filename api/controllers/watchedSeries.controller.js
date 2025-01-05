const db = require("../models/index.js");
const { ValidationError, Sequelize, where } = require("sequelize");
const axios = require('axios');

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

        let series = await Series.findOne({ where: { series_api_id: seriesId } });

        if (!series) {
            const apiResponse = await axios.get(`https://api.tvmaze.com/shows/${seriesId}?embed=seasons`);
            const apiData = apiResponse.data;

            const totalSeasons = apiData._embedded?.seasons.length || 0;

            const creatorResponse = await axios.get(`https://api.tvmaze.com/shows/${seriesId}?embed=crew`);

            const creators = creatorResponse.data._embedded.crew
                .filter(member => member.type === 'Creator')
                .map(creator => creator.person.name);

            const creatorNames = creators.length ? creators.join(', ') : 'Unknown';

            series = await Series.create({
                series_api_id: apiData.id,
                title: apiData.name,
                description: apiData.summary?.replace(/<\/?[^>]+(>|$)/g, ""),
                release_date: apiData.premiered,
                genre: apiData.genres.join(', '),
                total_seasons: totalSeasons,
                average_rating: apiData.rating?.average || null,
                poster_url: apiData.image?.original || null,
                creator: creatorNames,
            });
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
