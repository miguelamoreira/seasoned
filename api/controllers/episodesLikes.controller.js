const db = require("../models/index.js");
const { ValidationError, Sequelize, where } = require("sequelize");
const axios = require("axios");

const seriesUtil = require("../utils/series.js")

const Users = db.Users;
const Series = db.Series;
const Episodes = db.Episodes;
const EpisodeLikes = db.EpisodeLikes;

exports.getLikedEpisodes = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
            });
        }

        const likedEpisodes = await EpisodeLikes.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Episodes,
                    as: 'episodes',
                    attributes: ['episode_api_id', 'episode_title', 'season_id', 'episode_number', 'air_date', 'poster_url'],
                    include: [
                        {
                            model: Series,
                            as: 'series',
                            attributes: ['series_api_id', 'title', 'description', 'poster_url', 'average_rating', 'creator', 'release_date'],
                        },
                    ],
                },
            ],
        });

        const episodesData = likedEpisodes.map((like) => like.episodes);

        return res.status(200).json({
            message: 'Liked episodes fetched successfully.',
            data: episodesData,
        });
    } catch (error) {
        console.error('Error getting liked episodes: ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
};

exports.likeEpisodes = async (req, res) => {
    const userId = req.params.id;
    const { episodeId, seriesId } = req.body;

    if (!episodeId) {
        return res.status(400).json({
            message: 'Episode ID is required.',
        });
    }

    if (!seriesId) {
        return res.status(400).json({
            message: 'Series API ID is required.',
        });
    }

    try {
        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        let episode = await Episodes.findOne({ where: { episode_api_id: episodeId } });

        if (!episode) {
            const series = await Series.findOne({ where: { series_api_id: seriesId } });

            if (!series) {
                await seriesUtil.addSeriesWithSeasonsAndEpisodes(seriesId);
            }

            episode = await Episodes.findOne({ where: { episode_api_id: episodeId } });

            if (!episode) {
                return res.status(404).json({
                    message: 'Episode not found even after adding series.',
                });
            }
        }

        const existingLike = await EpisodeLikes.findOne({ where: { user_id: userId, episode_api_id: episodeId }});
        if (existingLike) {
            return res.status(400).json({
                message: 'You have already liked this episode.',
            });
        }

        await EpisodeLikes.create({ user_id: userId, episode_api_id: episodeId, like_date: new Date() });

        return res.status(201).json({
            message: 'Episode liked successfully.',
        });
    } catch (error) {
        console.error('Error liking episode: ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
};

exports.dislikeEpisodes = async (req, res) => {
    const userId = req.params.id;
    const { episodeId } = req.body;

    if (!episodeId) {
        return res.status(400).json({
            message: 'Episode ID is required.',
        });
    }

    try {
        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        const episode = await Episodes.findOne({ where: { episode_api_id: episodeId } });
        if (!episode) {
            return res.status(404).json({
                message: 'Episode not found.',
            });
        }

        const existingLike = await EpisodeLikes.findOne({
            where: { user_id: userId, episode_api_id: episodeId },
        });

        if (!existingLike) {
            return res.status(400).json({
                message: 'You have not liked this episode yet.',
            });
        }

        await EpisodeLikes.destroy({
            where: { user_id: userId, episode_api_id: episodeId },
        });

        return res.status(200).json({
            message: 'Episode disliked successfully.',
        });
    } catch (error) {
        console.error('Error disliking episode: ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
};
