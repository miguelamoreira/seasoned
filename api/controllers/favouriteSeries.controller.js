const db = require("../models/index.js");
const { ValidationError, Sequelize, where } = require("sequelize");
const axios = require("axios");

const seriesUtil = require("../utils/series.js")

const Users = db.Users;
const Series = db.Series;
const FavouriteSeries = db.FavouriteSeries;

exports.findAllFavouriteSeries = async (req, res) => {
    const userId = req.params.id;

    try {
        const favouriteSeries = await FavouriteSeries.findAll({
            where: { user_id: userId },
            include: [{
                model: Series,
                as: 'series',
                attributes: ['title', 'poster_url']
            }]
        })

        return res.status(200).json({
            message: 'Favorite series retrieved successfully',
            data: favouriteSeries
        });
    } catch (error) {
        console.error('Error getting favourite series:', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.'
        });
    }
}

exports.addFavouriteSeries = async (req, res) => {
    const userId = req.params.id;
    const { seriesId } = req.body; 

    if (!seriesId) {
        return res.status(400).json({
            message: 'Series ID is required.',
        });
    }

    try {
        const series = await Series.findOne({ where: { series_api_id: seriesId } });
        if (!series) {
            await seriesUtil.addSeriesWithSeasonsAndEpisodes(seriesId);
        }

        const favouriteCount = await FavouriteSeries.count({ where: { user_id: userId } });
        if (favouriteCount >= 3) {
            return res.status(400).json({
                message: 'A user can have a maximum of 3 favourites',
            })
        }

        const existingFavourite = await FavouriteSeries.findOne({ where: { user_id: userId, series_api_id: seriesId }})
        if (existingFavourite) {
            return res.status(400).json({
                message: 'The user already has this series in their favourites',
            })
        }

        const newFavourite = await FavouriteSeries.create({ user_id: userId, series_api_id: seriesId, display_order: favouriteCount + 1,})

        return res.status(200).json({
            message: 'Series added to favourites successfully',
            data: newFavourite,
        })
    } catch (error) {
        console.error('Error adding favourite series: ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
};

exports.deleteFavouriteSeries = async (req, res) => {
    const userId = req.params.id;
    const { seriesId } = req.body;

    try {
        const existingFavourite = await FavouriteSeries.findOne({ where: { user_id: userId, series_api_id: seriesId } })
        if (!existingFavourite) {
            return res.status(404).json({
                message: "Series not found in user's favourites"
            })
        }

        await FavouriteSeries.update(
            { display_order: Sequelize.literal('display_order - 1') },
            {
                where: {
                    user_id: userId,
                    display_order: { [Sequelize.Op.gt]: existingFavourite.display_order }
                }
            }
        );

        await FavouriteSeries.destroy({
            where: { user_id: userId, series_api_id: seriesId }
        });

        return res.status(200).json({
            message: 'Series removed from favourites'
        })
    } catch (error) {
        console.error('Error deleting favourite series:', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.'
        });
    }
}