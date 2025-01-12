const db = require("../models/index.js");
const { ValidationError, Sequelize, where } = require("sequelize");
const axios = require('axios');

const Users = db.Users;
const Series = db.Series;
const Reviews = db.Reviews;
const ReviewLikes = db.ReviewLikes;
const ReviewComments = db.ReviewComments;

exports.getMostPopularSeries = async (req, res) => {
    try {
        const mostLikedSeries = await Series.findAll({
            attributes: {
                include: [
                    [Sequelize.literal('(SELECT COUNT(*) FROM SeriesLikes WHERE SeriesLikes.series_api_id = Series.series_api_id)'), 'likeCount']
                ]
            },
            order: [[Sequelize.literal('likeCount'), 'DESC']],
            limit: 10,
        });

        if (!mostLikedSeries || mostLikedSeries.length === 0) {
            return res.status(404).json({
                message: 'No liked series found.',
            });
        }

        return res.status(200).json({
            message: 'Most liked series fetched successfully.',
            data: mostLikedSeries,
        });
    } catch (error) {
        console.error('Error getting most liked series: ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
};

exports.findSeriesById = async (req, res) => {
    const seriesId = req.params.id;

    try {
        let series = await Series.findOne({
            where: { series_api_id: seriesId },
        });

        let reviews = [];
        let ratings = [0, 0, 0, 0, 0]; 

        if (series) {
            reviews = await Reviews.findAll({
                where: { series_api_id: seriesId },
                attributes: [ 'review_id', 'user_id', 'score', 'comment', 'review_date',],
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
                        attributes: ['user_id', 'like_date']
                    },
                    {
                        model: ReviewComments,
                        as: 'comments',
                        attributes: ['comment_id', 'user_id', 'comment', 'comment_date']
                    },
                ]
            });

            reviews.forEach(review => {
                const score = review.score;
                if (score >= 1 && score <= 5) {
                    ratings[score - 1] += 1;
                }
            });
        }

        const seriesApiResponse = await axios.get(`https://api.tvmaze.com/shows/${seriesId}?embed=seasons`);
        const seriesApiData = seriesApiResponse.data;

        const creatorResponse = await axios.get(`https://api.tvmaze.com/shows/${seriesId}?embed=crew`);
        const creators = creatorResponse.data._embedded.crew
            .filter(member => member.type === 'Creator')
            .map(creator => creator.person.name);
        const creatorNames = creators.length ? creators.join(', ') : 'Unknown';

        const castResponse = await axios.get(`https://api.tvmaze.com/shows/${seriesId}?embed=cast`);
        const castData = castResponse.data._embedded.cast;
        const castDetails = castData.map(member => ({
            name: member.person.name,
            image: member.person.image?.original || null,
            role: member.character.name,
        }));

        const totalSeasons = seriesApiData._embedded?.seasons.length || 0;

        const seriesData = {
            series_api_id: seriesApiData.id,
            title: seriesApiData.name,
            description: seriesApiData.summary?.replace(/<\/?[^>]+(>|$)/g, ""),
            year: seriesApiData.premiered.split('-')[0],
            ended: seriesApiData.ended ? seriesApiData.ended.split('-')[0] : null,
            genre: seriesApiData.genres,
            total_seasons: totalSeasons,
            average_rating: seriesApiData.rating?.average || null,
            poster_url: seriesApiData.image?.original || null,
            creator: creatorNames,
            cast: castDetails,
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
            message: 'Series retrieved successfully',
            data: seriesData
        });

    } catch (error) {
        console.error('Error fetching series details:', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
};