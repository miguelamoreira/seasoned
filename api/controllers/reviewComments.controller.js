const db = require("../models/index.js");
const { ValidationError, Sequelize, where } = require("sequelize");

const Users = db.Users;
const Reviews = db.Reviews;
const ReviewComments = db.ReviewComments;
const Notifications = db.Notifications;

exports.getCommentsByReviewId = async (req, res) => {
    const reviewId = req.params.id;

    try {
        const review = await Reviews.findByPk(reviewId);
        if (!review) {
            return res.status(404).json({
                message: 'Review not found.'
            });
        }

        const comments = await ReviewComments.findAll({
            where: { review_id: reviewId },
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['user_id', 'name', 'avatar'], 
                },
            ],
            order: [['comment_date', 'DESC']], 
        });

        return res.status(200).json({
            review_id: reviewId,
            data: comments,
        });
    } catch (error) {
        console.error('Error retrieving comments:', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
}


exports.addCommentToReview = async (req, res) => {
    const reviewId = req.params.id;
    const { userId, comment } = req.body;

    if (!userId || !comment) {
        return res.status(400).json({
            message: 'User id and comment are required.',
        })
    }
    try {
        const review = await Reviews.findByPk(reviewId);
        if (!review) {
            return res.status(404).json({
                message: 'Review not found.'
            })
        }

        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found.'
            })
        }

        const newComment = await ReviewComments.create({
            review_id: reviewId,
            user_id: userId,
            comment,
            comment_date: new Date(),
        });

        const user1 = await Users.findByPk(userId)
        const newNotification = await Notifications.create({
            user_id: review.user_id,
            notificationType: 'activity',
            variant: 'newComments',
            message: `${user1.name} added a comment to your review`,
            comment_id: newComment.comment_id
        })
        
        return res.status(201).json({
            message: 'Comment added successfully.',
            data: newComment,
        });
    } catch (error) {
        console.error('Error adding comment to review: ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
}