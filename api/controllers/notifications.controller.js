const db = require("../models/index.js");
const { Op } = require("sequelize");

const Users = db.Users;
const Notifications = db.Notifications;
const NotificationsConfig = db.NotificationsConfig;

exports.getNotificationsByUserId = async (req, res) => {
    const userId = req.params.id;

    try {
        const userConfig = await NotificationsConfig.findOne({
            where: { user_id: userId },
        });

        if (!userConfig) {
            return res.status(404).json({
                message: 'User notifications configuration not found'
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

        return res.status(200).json({
            message: 'Notifications retrieved successfully',
            data: notifications,
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later',
        });
    }
};
