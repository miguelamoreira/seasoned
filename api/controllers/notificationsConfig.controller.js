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
                message: 'User not found'
            })
        }

        const config = await NotificationsConfig.findByPk(userId);
        if (!config) {
            return res.status(404).json({
                message: 'Configurations not found'
            })
        }

        config.earnedBadges = earnedBadges;
        config.newFollowers = newFollowers;
        config.newComments = newComments;
        config.newLikes = newLikes;
        config.upcomingEpisodes = upcomingEpisodes;
        config.seasonEpisodes = seasonEpisodes;

        config.save();

        return res.status(200).json({
            message: 'Configurations updated successfully',
            data: config,
        })
    } catch (error) {
        console.error('Error updating notifications configurations:', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
}