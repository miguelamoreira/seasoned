const db = require("../models/index.js");
const { ValidationError, Sequelize, where } = require("sequelize");
const axios = require('axios');

const Users = db.Users;
const Series = db.Series;
const Seasons = db.Seasons;
const Episodes = db.Episodes;
const EpisodeLikes = db.EpisodeLikes;
const Reviews = db.Reviews;
const ReviewLikes = db.ReviewLikes;
const ReviewComments = db.ReviewComments;

exports.findEpisodeById = async (req, res) => {
    const episodeId = req.params.id;

    try {
        const episodeResponse = await axios.get(`https://api.tvmaze.com/episodes/${episodeId}`);
        const episodeData = episodeResponse.data;

        let reviews = [];
        let ratings = [0, 0, 0, 0, 0]; 

        reviews = await Reviews.findAll({
            where: { episode_api_id: episodeId },
            attributes: ['review_id', 'user_id', 'score', 'comment', 'review_date'],
            limit: 2,
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['user_id', 'name', 'avatar'],
                },
                {
                    model: ReviewLikes,
                    as: 'likes',
                    attributes: ['user_id', 'like_date'],
                },
                {
                    model: ReviewComments,
                    as: 'comments',
                    attributes: ['comment_id', 'user_id', 'comment', 'comment_date'],
                },
            ],
        });

        reviews.forEach(review => {
            const score = review.score;
            if (score >= 1 && score <= 5) {
                ratings[score - 1] += 1;
            }
        });

        const episode = {
            id: episodeData.id,
            title: episodeData.name,
            description: episodeData.summary ? episodeData.summary.replace(/<\/?[^>]+(>|$)/g, "") : null,
            series: episodeData._links.show.name,
            season: episodeData.season,
            episode: episodeData.number,
            airdate: episodeData.airdate,
            image: episodeData.image?.medium || null,
            rating: episodeData.rating?.average || null,
            url: episodeData.url,
            reviews: reviews.map(review => ({
                id: review.review_id,
                user_id: review.user.user_id,
                username: review.user.name,
                avatar: review.user.avatar,
                rating: review.score,
                review: review.comment,
                review_date: review.review_date,
                likes: review.ReviewLikes ? review.ReviewLikes.length : 0,
                comments: review.ReviewComments ? review.ReviewComments.length : 0,
            })),
            ratings,
        };

        return res.status(200).json({
            message: 'Episode retrieved successfully',
            data: episode,
        });

    } catch (error) {
        console.error('Error fetching episode details:', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
};

exports.findEpisodesBySeries = async (req, res) => {
    const seriesId = req.params.id;

    try {
        const seriesApiResponse = await axios.get(`https://api.tvmaze.com/shows/${seriesId}?embed=seasons`);
        const seriesApiData = seriesApiResponse.data;

        const totalSeasons = seriesApiData._embedded?.seasons.length || 0;

        const seasonsWithEpisodes = await Promise.all(
            seriesApiData._embedded?.seasons.map(async (season) => {
                const episodesResponse = await axios.get(`https://api.tvmaze.com/seasons/${season.id}/episodes`);
                const episodesData = episodesResponse.data;

                const episodes = episodesData.map((episode) => ({
                    id: episode.id,
                    number: episode.number,
                    season: episode.season,
                }));

                return {
                    id: season.id,
                    number: season.number,
                    episodeOrder: season.episodeOrder,
                    episodes,
                };
            })
        );

        const seriesData = {
            series_api_id: seriesApiData.id,
            title: seriesApiData.name,
            year: seriesApiData.premiered.split('-')[0],
            ended: seriesApiData.ended ? seriesApiData.ended.split('-')[0] : null,
            genre: seriesApiData.genres,
            total_seasons: totalSeasons,
            seasons: seasonsWithEpisodes,
            average_rating: seriesApiData.rating?.average || null,
            poster_url: seriesApiData.image?.original || null,
        };

        return res.status(200).json({
            message: 'Series and episodes retrieved successfully',
            data: seriesData,
        });
    } catch (error) {
        console.error('Error fetching series and episodes details:', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
};