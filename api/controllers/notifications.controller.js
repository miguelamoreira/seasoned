const db = require("../models/index.js");
const { Op } = require("sequelize");

const Users = db.Users;
const Notifications = db.Notifications;
const NotificationsConfig = db.NotificationsConfig;
const Reviews = db.Reviews;
const ReviewComments = db.ReviewComments

exports.getNotificationsByUserId = async (req, res) => {
    const userId = req.params.id;

    try {
        const userConfig = await NotificationsConfig.findOne({
            where: { user_id: userId },
        });

        if (!userConfig) {
            return res.status(404).json({
                message: 'User notifications configuration not found',
            });
        }

        const enabledNotificationVariants = [];

        if (userConfig.earnedBadges) enabledNotificationVariants.push('earnedBadges');
        if (userConfig.newFollowers) enabledNotificationVariants.push('newFollowers');
        if (userConfig.newComments) enabledNotificationVariants.push('newComments');
        if (userConfig.newLikes) enabledNotificationVariants.push('newLikes');

        const notifications = await Notifications.findAll({
            where: {
                user_id: userId,
                variant: {
                    [Op.in]: enabledNotificationVariants,
                },
            },
        });

        const formattedNotifications = await Promise.all(notifications.map(async (notification) => {
            let formattedNotification = {
                notification_id: notification.notification_id,
                user_id: notification.user_id,
                notificationType: notification.notificationType,
                variant: notification.variant,
                message: notification.message,
                date: notification.date,
                review_id: notification.review_id,
                comment_id: notification.comment_id,
            };

            if (notification.variant === 'newLikes' && notification.review_id) {
                try {
                    const review = await Reviews.findByPk(notification.review_id);

                    if (review) {
                        formattedNotification.review = {
                            rating: review.score,
                            review: review.comment,
                        };
                    }
                } catch (error) {
                    console.error('Error fetching review for notification:', error);
                }
            }

            if (notification.variant === 'newComments' && notification.comment_id) {
                try {
                    const review = await ReviewComments.findByPk(notification.comment_id);

                    if (review) {
                        formattedNotification.comment = {
                            review: review.comment,
                        };
                    }
                } catch (error) {
                    console.error('Error fetching review for notification:', error);
                }
            }

            return formattedNotification;
        }));

        return res.status(200).json({
            message: 'Notifications retrieved successfully',
            data: formattedNotifications,
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later',
        });
    }
};