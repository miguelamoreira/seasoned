const db = require("../models/index.js");
const { ValidationError, Sequelize, where } = require("sequelize");
const axios = require("axios");

const Users = db.Users;
const Series = db.Series;
const Episodes = db.Episodes;
const Reviews = db.Reviews;
const ReviewComments = db.ReviewComments;
const ReviewLikes = db.ReviewLikes;

exports.getRatingsGroupedByScore = async (req, res) => {
    const userId = req.params.id;

    try {   
        const ratings = await Reviews.findAll({ where: { user_id: userId }, attributes: ['score'] })

        const groupedRatings = [1, 2, 3, 4, 5].reduce((acc, score) => {
            acc[score] = ratings.filter(rating => rating.score === score).length;
            return acc;
        }, {})

        return res.status(200).json({
            message: 'Ratings grouped by score retrieved successfully',
            data: groupedRatings
        })
    } catch (error) {
        console.error('Error getting ratings grouped by score: ', error)
        return res.status(500).json({
            message: 'Something went wrong. Please try again later'
        })
    }
}

exports.getReviews = async (req, res) => {
    try {
        const reviews = await Reviews.findAll({
            include: [
                {
                    model: Series,
                    as: 'series',
                    attributes: ['title', 'release_date', 'average_rating', 'poster_url', 'creator']
                },
                {
                    model: ReviewComments,
                    as: 'comments',
                    attributes: ['comment_id', 'user_id', 'comment', 'comment_date'],
                    include: [{
                        model: Users,
                        as: 'user',
                        attributes: ['user_id', 'name', 'avatar']
                    }]
                },
                {
                    model: ReviewLikes,
                    as: 'likes',
                    attributes: ['user_id', 'like_date'],
                    include: [{
                        model: Users,
                        as: 'user',
                        attributes: ['user_id', 'name', 'avatar']
                    }]
                }
            ]
        });

        return res.status(200).json({
            message: 'Reviews retrieved successfully',
            data: reviews,
        })
    } catch (error) {
        console.error('Error getting reviews: ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
}

exports.getReviewById = async (req, res) => {
    const reviewId = req.params.id;

    try {
        const review = await Reviews.findOne({
            where: { review_id: reviewId },
            include: [
                {
                    model: Series,
                    as: 'series', 
                    attributes: ['title', 'description', 'poster_url', 'average_rating', 'release_date']
                },
                reviewId ? {
                    model: Episodes,
                    as: 'episodes',
                    attributes: ['episode_title', 'season_id', 'episode_number', 'air_date', 'poster_url']
                } : null,
                {
                    model: ReviewComments,
                    as: 'comments',
                    attributes: ['comment_id', 'user_id', 'comment', 'comment_date'],
                    include: [{
                        model: Users,
                        as: 'user',
                        attributes: ['user_id', 'name', 'avatar']
                    }]
                },
                {
                    model: ReviewLikes,
                    as: 'likes',
                    attributes: ['user_id', 'like_date'],
                    include: [{
                        model: Users,
                        as: 'user',
                        attributes: ['user_id', 'name', 'avatar']
                    }]
                }
            ].filter(Boolean)
        });

        if (!review) {
            return res.status(404).json({
                message: 'Review not found.',
            });
        }

        return res.status(200).json({
            message: 'Review fetched successfully.',
            data: review,
        });
    } catch (error) {
        console.error("Error retrieving review: ", error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
}

exports.getReviewsByUserId = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await Users.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const reviews = await Reviews.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Series,
                    as: 'series',
                    attributes: ['title', 'description', 'poster_url', 'average_rating', 'release_date']
                },
                {
                    model: ReviewComments,
                    as: 'comments',
                    attributes: ['comment_id', 'user_id', 'comment', 'comment_date'],
                    include: [{
                        model: Users,
                        as: 'user',
                        attributes: ['user_id', 'name', 'avatar']
                    }]
                },
                {
                    model: ReviewLikes,
                    as: 'likes',
                    attributes: ['user_id', 'like_date'],
                    include: [{
                        model: Users,
                        as: 'user',
                        attributes: ['user_id', 'name', 'avatar']
                    }]
                }
            ],
        })

        return res.status(200).json({
            message: 'Reviews fetched successfully.',
            data: reviews,
        });
    } catch (error) {
        console.error("Error getting user's reviews: ", error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
}

exports.getReviewsBySeriesId = async (req, res) => {
    const seriesId = req.params.id;

    try {
        const reviews = await Reviews.findAll({
            where: { series_api_id: seriesId },
            include: [
                {
                    model: Series,
                    as: 'series',
                    attributes: ['title', 'description', 'poster_url', 'average_rating', 'release_date']
                },
                {
                    model: ReviewComments,
                    as: 'comments',
                    attributes: ['comment_id', 'user_id', 'comment', 'comment_date'],
                    include: [{
                        model: Users,
                        as: 'user',
                        attributes: ['user_id', 'name', 'avatar']
                    }]
                },
                {
                    model: ReviewLikes,
                    as: 'likes',
                    attributes: ['user_id', 'like_date'],
                    include: [{
                        model: Users,
                        as: 'user',
                        attributes: ['user_id', 'name', 'avatar']
                    }]
                }
            ],
        })

        if (reviews.length === 0) {
            return res.status(404).json({
                message: 'No reviews found for this series.',
            })
        }

        return res.status(200).json({
            message: 'Reviews fetched successfully.',
            data: reviews,
        });
    } catch (error) {
        console.error("Error retrieving series reviews: ", error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
}

exports.getReviewsByEpisodeId = async (req, res) => {
    const episodeId = req.params.id;

    try {
        const reviews = await Reviews.findAll({ where: { episode_api_id: episodeId },
            include: [
                {
                    model: Series,
                    as: 'series',
                    attributes: ['title', 'description', 'poster_url', 'average_rating']
                },
                {
                    model: Episodes,
                    as: 'episodes',
                    attributes: ['episode_title', 'season_id', 'episode_number', 'air_date', 'poster_url']
                },
                {
                    model: ReviewComments,
                    as: 'comments',
                    attributes: ['comment_id', 'user_id', 'comment', 'comment_date'],
                    include: [{
                        model: Users,
                        as: 'user',
                        attributes: ['user_id', 'name', 'avatar']
                    }]
                },
                {
                    model: ReviewLikes,
                    as: 'likes',
                    attributes: ['user_id', 'like_date'],
                    include: [{
                        model: Users,
                        as: 'user',
                        attributes: ['user_id', 'name', 'avatar']
                    }]
                }
            ],
        })

        if (reviews.length === 0) {
            return res.status(404).json({
                message: 'No reviews found for this episode.',
            })
        }

        return res.status(200).json({
            message: 'Reviews fetched successfully.',
            data: reviews,
        });
    } catch (error) {
        console.error("Error retrieving episode reviews: ", error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
}
 
exports.createReviews = async (req, res) => {
    const { user_id, reviews } = req.body;

    if (!user_id || !reviews || !Array.isArray(reviews) || reviews.length === 0) {
        return res.status(400).json({ 
            message: 'User ID and a non-empty array of reviews are required.' 
        });
    }

    try {
        const user = await Users.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found.' 
            });
        }

        const createdReviews = [];
        for (let review of reviews) {
            const { series_api_id, episode_api_id, score, comment } = review;

            if (!series_api_id || !score) {
                return res.status(400).json({ 
                    message: 'Series API ID and Score are required for each review.' 
                });
            }

            if (score < 1 || score > 5) {
                return res.status(400).json({ 
                    message: 'Score must be between 1 and 5.' 
                });
            }

            let series = await Series.findOne({ where: { series_api_id } });

            if (!series) {
                const apiResponse = await axios.get(`https://api.tvmaze.com/shows/${series_api_id}?embed=seasons`);
                const apiData = apiResponse.data;

                const totalSeasons = apiData._embedded?.seasons.length || 0;
                const creatorResponse = await axios.get(`https://api.tvmaze.com/shows/${series_api_id}?embed=crew`);
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

            if (episode_api_id) {
                let episode = await Episodes.findOne({ where: { episode_api_id } });

                if (!episode) {
                    const episodeResponse = await axios.get(`https://api.tvmaze.com/episodes/${episode_api_id}`);
                    const episodeData = episodeResponse.data;

                    episode = await Episodes.create({
                        episode_api_id: episodeData.id,
                        season_id: episodeData.season,
                        episode_title: episodeData.name,
                        episode_number: episodeData.number,
                        duration: episodeData.runtime,
                        air_date: episodeData.airdate,
                        poster_url: episodeData.image?.original || null,
                    });
                }
            }

            const reviewData = {
                user_id,
                series_api_id,
                score,
                comment,
            };

            if (episode_api_id) {
                reviewData.episode_api_id = episode_api_id;
            }

            const newReview = await Reviews.create(reviewData);
            createdReviews.push(newReview);
        }

        return res.status(201).json({
            message: 'Review(s) created successfully.',
            data: createdReviews,
        });
    } catch (error) {
        console.error('Error creating reviews: ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
};

exports.getMostPopularReviews = async (req, res) => {
    try {
        const reviews = await Reviews.findAll({
            attributes: {
                include: [
                    [Sequelize.literal('(SELECT COUNT(*) FROM ReviewLikes WHERE ReviewLikes.review_id = Reviews.review_id)'), 'likeCount']
                ]
            },
            include: [
                {
                    model: Series,
                    as: 'series',
                    attributes: ['title', 'poster_url', 'average_rating', 'release_date']
                },
                {
                    model: Episodes,
                    as: 'episodes',
                    attributes: ['episode_title', 'season_id', 'episode_number', 'air_date', 'poster_url']
                },
                {
                    model: ReviewComments,
                    as: 'comments',
                    attributes: ['comment_id', 'user_id', 'comment', 'comment_date'],
                    include: [{
                        model: Users,
                        as: 'user',
                        attributes: ['user_id', 'name', 'avatar']
                    }]
                },
                {
                    model: Users,
                    as: 'user',
                    attributes: ['user_id', 'name', 'avatar'],
                },
                {
                    model: ReviewLikes,
                    as: 'likes',
                    attributes: ['review_id'],
                    duplicating: false,
                },
            ],
            order: [[Sequelize.literal('likeCount'), 'DESC']],
            limit: 10,
        });

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({
                message: 'No popular reviews found.'
            });
        }

        const formattedReviews = reviews.map(review => {
            return {
                reviewId: review.review_id,
                comment: review.comment,
                rating: review.score,
                likeCount: review.likes.length,
                series: review.series ? {
                    title: review.series.title,
                    posterUrl: review.series.poster_url,
                    averageRating: review.series.average_rating,
                    year: review.series.release_date,
                } : null,
                episode: review.episodes ? {
                    episodeTitle: review.episodes.episode_title,
                    seasonId: review.episodes.season_id,
                    episodeNumber: review.episodes.episode_number,
                    airDate: review.episodes.air_date,
                    posterUrl: review.episodes.poster_url,
                } : null,
                comments: review.comments.map(comment => ({
                    commentId: comment.comment_id,
                    userId: comment.user_id,
                    commentBody: comment.comment,
                    commentDate: comment.comment_date,
                    user: comment.user ? {
                        userId: comment.user.user_id,
                        name: comment.user.name,
                        avatar: comment.user.avatar,
                    } : null,
                })),
                user: review.user ? {
                    userId: review.user.user_id,
                    name: review.user.name,
                    avatar: review.user.avatar,
                } : null,
            };
        });

        return res.status(200).json({
            message: 'Most popular reviews retrieved successfully.',
            data: formattedReviews
        });
    } catch (error) {
        console.error('Error retrieving most popular reviews:', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.'
        });
    }
};
