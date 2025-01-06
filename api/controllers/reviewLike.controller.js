const db = require("../models/index.js");
const { ValidationError, Sequelize, where } = require("sequelize");
const axios = require("axios");

const Users = db.Users;
const Series = db.Series;
const Episodes = db.Episodes;
const Reviews = db.Reviews;
const ReviewComments = db.ReviewComments;
const ReviewLikes = db.ReviewLikes;

exports.getLikedReviews = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await Users.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
            });
        }

        const likedReviews = await ReviewLikes.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Reviews,
                    as: 'reviews',
                    attributes: ['review_id', 'comment', 'score', 'series_api_id', 'episode_api_id', 'user_id'],
                    include: [
                        {
                            model: Users,
                            as: 'user',  
                            attributes: ['user_id', 'name', 'avatar'], 
                        },
                        {
                            model: Series,
                            as: 'series',
                            attributes: ['title', 'description', 'poster_url', 'average_rating', 'release_date'],
                        },
                        {
                            model: Episodes,
                            as: 'episodes',
                            attributes: ['episode_title', 'season_id', 'episode_number', 'air_date', 'poster_url'],
                        },
                        {
                            model: ReviewComments,
                            as: 'comments',
                            attributes: ['comment_id', 'user_id', 'comment', 'comment_date'],
                        },
                        {
                            model: ReviewLikes,
                            as: 'likes',
                            attributes: ['user_id', 'like_date'],
                        },
                    ],
                },
            ],
        });

        return res.status(200).json({
            message: 'Liked reviews fetched successfully.',
            data: likedReviews,
        });
    } catch (error) {
        console.error('Error getting liked reviews: ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
};

exports.likeReviews = async (req, res) => {
    const userId = req.params.id;
    const { reviewId } = req.body;

    if (!reviewId) {
        return res.status(400).json({
            message: 'Review id is required.'
        });
    }

    try {
        const review = await Reviews.findByPk(reviewId);
        if (!review) {
            return res.status(404).json({
                message: 'Review not found.'
            })
        }

        const existingLike = await ReviewLikes.findOne({where: { user_id: userId, review_id: reviewId }})
        if (existingLike) {
            return res.status(400).json({
                message: 'You have already liked this review.'
            })
        }

        await ReviewLikes.create({ user_id: userId, review_id: reviewId, like_date: new Date()})

        return res.status(201).json({
            message: 'Review liked successfully.',
        });
    } catch (error) {
        console.error('Error liking the review: ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
}

exports.dislikeReviews = async (req, res) => {
    const userId = req.params.id;
    const { reviewId } = req.body;

    if (!reviewId) {
        return res.status(400).json({
            message: 'Review id is required.'
        });
    }

    try {
        const review = await Reviews.findByPk(reviewId);
        if (!review) {
            return res.status(404).json({
                message: 'Review not found.'
            })
        }

        const existingLike = await ReviewLikes.findOne({where: { user_id: userId, review_id: reviewId }});

        if (!existingLike) {
            return res.status(400).json({
                message: "You haven't liked this review yet."
            })
        }

        await ReviewLikes.destroy({where: { user_id: userId, review_id: reviewId }});

        return res.status(200).json({
            message: 'Review disliked successfully.',
        });
    } catch (error) {
        console.error('Error disliking the review: ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
}