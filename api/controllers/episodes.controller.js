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
            season: episodeData.season,
            episode: episodeData.number,
            airdate: episodeData.airdate,
            image: episodeData.image?.medium || null,
            rating: episodeData.rating?.average || null,
            url: episodeData.url,  // URL to the episode page on TVMaze
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