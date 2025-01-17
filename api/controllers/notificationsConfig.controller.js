const db = require("../models/index.js");
const { ValidationError, Sequelize, where, Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWTconfig } = require("../config/db.config.js");

const Users = db.Users;
const NotificationsConfig = db.NotificationsConfig;

exports.getNotificationsConfigurations = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const config = await NotificationsConfig.findByPk(userId);
        if (!config) {
            return res.status(404).json({
                message: 'Configurations not found'
            })
        }

        return res.status(200).json({
            message: 'Configurations retrieved successfully',
            data: config
        })
    } catch (error) {
        console.error('Error fetching notifications configurations:', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
}

exports.updateNotificationsConfigurations = async (req, res) => {
    const userId = req.params.id;
    const { earnedBadges, newFollowers, newComments, newLikes, upcomingEpisodes, seasonEpisodes } = req.body;

    try {
        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        const config = await NotificationsConfig.findOne({ where: { user_id: userId } });
        if (!config) {
            return res.status(404).json({
                message: 'Notification configurations not found',
            });
        }

        const updatedConfig = await config.update({
            earnedBadges,
            newFollowers,
            newComments,
            newLikes,
            upcomingEpisodes,
            seasonEpisodes,
        });

        return res.status(200).json({
            message: 'Configurations updated successfully',
            data: updatedConfig,
        });
    } catch (error) {
        console.error('Error updating notifications configurations:', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
};