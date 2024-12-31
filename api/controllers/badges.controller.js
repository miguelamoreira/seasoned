const db = require("../models/index.js");
const { ValidationError, Sequelize, where } = require("sequelize");

const Badges = db.Badges;
const Users = db.Users;
const EarnedBadges = db.EarnedBadges;

exports.findAllBadges = async (req, res) => {
    try {
        const badges = await Badge.findAll();

        return res.status(200).json({
            message: 'Badges retrieved successfully',
            data: badges,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.'
        })
    }
}

exports.getBadgeById = async (req, res) => {
    const badgeId = req.params.id;

    try {
        const badge = await Badge.findOne({ where: { badge_id: badgeId } });

        if (!badge) {
            return res.status(404).json({
                message: 'Badge not found'
            })
        }

        return res.status(200).json({
            message: `Badge ${badgeId} retrieve successfully`,
            data: badge
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.'
        })
    }
}

exports.findEarnedBadges = async (req, res) => {
    const userId = req.params.id;
    
    try {
        let earnedBadges = await EarnedBadges.findAll({
            where: {
                user_id: userId
            },
            include: [
                {
                    model: Badge,  
                    as: 'badge',  // Use the alias defined in the association
                    attributes: ['badge_id', 'name', 'description', 'howTo', 'image']
                }
            ]
        });

        if (!earnedBadges || earnedBadges.length === 0) {
            return res.status(404).json({
                message: 'No earned badges found for this user.'
            });
        }

        return res.status(200).json({
            message: 'Earned badges retrieved successfully',
            data: earnedBadges
        });
    } catch (error) {
        console.error('Error fetching earned badges:', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.'
        })
    }
}

exports.getBadgesComparison = async (req, res) => {
    const userId = req.params.id;

    try {
        const allBadges = await Badges.findAll();

        const earnedBadges = await EarnedBadges.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Badges,
                    as: 'badge',
                    attributes: ['badge_id', 'name', 'description', 'howTo', 'image']
                }
            ]
        });

        const earnedBadgeIds = earnedBadges.map((earnedBadge) => {
            if (earnedBadge.Badges) {
                return earnedBadge.Badges.badge_id;
            }
            return null;
        }).filter((badgeId) => badgeId !== null);

        const badgesWithEarnedStatus = allBadges.map((badge) => {
            return {
                ...badge.dataValues,
                earned: earnedBadgeIds.includes(badge.badge_id)
            };
        });

        return res.status(200).json({
            message: 'Badges comparison retrieved successfully',
            data: badgesWithEarnedStatus
        });
    } catch (error) {
        console.error('Error fetching badges for user:', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.'
        });
    }
};

exports.addEarnedBadges = async (req, res) => {
    const userId = req.params.id;
    const { badgeId } = req.body

    try {
        if (!badgeId) {
            return res.status(400).json({
                message: 'Please provide a badgeId.'
            })
        }

        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found.'
            })
        }

        const existingBadge = await EarnedBadges.findOne({
            where: {
                user_id: userId,
                badge_id: badgeId
            }
        })
        if (existingBadge) {
            return res.status(409).json({
                message: 'User has already earned this badge.'
            })
        }

        const newBadge = await EarnedBadges.create({
            user_id: userId,
            badge_id: badgeId,
            earned_date: new Date(),
        });

        return res.status(201).json({
            message: 'Badge added successfully',
            data: newBadge
        });
    } catch (error) {
        console.error('Error adding badge:', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.'
        });
    }
}