const db = require("../models/index.js");
const { ValidationError, Sequelize, where } = require("sequelize");

const Badges = db.Badges;
const Users = db.Users;
const EarnedBadges = db.EarnedBadges;
const Notifications = db.Notifications;

exports.findAllBadges = async (req, res) => {
    try {
        const badges = await Badges.findAll();

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

exports.findBadgeById = async (req, res) => {
    const badgeId = req.params.id;
    const userId = req.params.userId;

    try {
        const badge = await Badges.findOne({ where: { badge_id: badgeId } });

        if (!badge) {
            return res.status(404).json({
                message: 'Badge not found'
            });
        }

        const earnedBadge = await EarnedBadges.findOne({
            where: {
                user_id: userId,
                badge_id: badgeId
            }
        });

        const badgeData = {
            ...badge.dataValues,
            earned: earnedBadge ? true : false,
            earned_date: earnedBadge ? earnedBadge.earned_date : null,
        };

        return res.status(200).json({
            message: `Badge ${badgeId} retrieved successfully`,
            data: badgeData
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.'
        });
    }
};

exports.findEarnedBadges = async (req, res) => {
    const userId = req.params.id;
    
    try {
        let earnedBadges = await EarnedBadges.findAll({
            where: {
                user_id: userId
            },
            include: [
                {
                    model: Badges,  
                    as: 'badge',
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

exports.findBadgesComparison = async (req, res) => {
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
            return earnedBadge.badge ? earnedBadge.badge.badge_id : null;
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


        const Badge = await Badges.findByPk(badgeId);
        const newNotification = await Notifications.create({
            user_id: userId,
            notificationType: 'activity',
            variant: 'earnedBadges',
            message: `You earned a new badge: ${Badge.name}`
        })

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

exports.updateBadgesVisibility = async (req, res) => {
    const userId = req.params.id;
    const { badges_visibility } = req.body;

    try {
        if (typeof badges_visibility !== 'boolean') {
            return res.status(400).json({
                message: 'badges_visibility must be a boolean.',
            });
        }

        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
            });
        }

        user.badges_visibility = badges_visibility;
        await user.save();

        return res.status(200).json({
            message: 'Badges visibility updated successfully',
            data: { user_id: userId, badges_visibility: user.badges_visibility }
        })
    } catch (error) {
        console.error('Error updating badges visibility: ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.'
        })
    }
}