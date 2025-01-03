const db = require("../models/index.js");
const { ValidationError, Sequelize, where } = require("sequelize");

const Users = db.Users;
const FollowingUsers = db.FollowingUsers;

exports.getFollowingUsers = async (req, res) => {
    const userId = req.params.id;

    try {
        const followingUsers = await FollowingUsers.findAll({
            where: { user1_id: userId },
            include: {
                model: Users,
                as: 'followingUser',
                attributes: [ 'user_id', 'name', 'avatar' ]
            }
        })

        const result = followingUsers.map(entry => entry.followingUser);

        return res.status(200).json({
            message: 'Following users retrieved successfully',
            data: result
        })
    } catch (error) {
        console.error('Error fetching following users:', error);
        return res.status(500).json({ 
            message: 'Something went wrong. Please try again later' 
        });
    }
}

exports.addFollowing = async (req, res) => {
    const user1_id = req.params.id; 
    const { user2_id } = req.body;

    try {
        
        if (user1_id === user2_id) {
            return res.status(400).json({
                message: 'A user cannot follow themselves'
            })
        }

        const existingFollowing = await FollowingUsers.findOne({ where: { user1_id, user2_id } })
        if (existingFollowing) {
            return res.status(400).json({
                message: 'Already following this user'
            })
        }

        const newFollowing = await FollowingUsers.create({ user1_id, user2_id })

        return res.status(200).json({
            message: 'Following added successfully',
            data: newFollowing
        })
    } catch (error) {
        console.error('Error adding following:', error);
        return res.status(500).json({ 
            message: 'Something went wrong. Please try again later' 
        });
    }
}

exports.getFollowers = async (req, res) => {
    const userId = req.params.id;

    try {   
        const followers = await FollowingUsers.findAll({
            where: { user2_id: userId },
            include: {
                model: Users,
                as: 'followerUser',
                attributes: [ 'user_id', 'name', 'avatar' ]
            }
        })

        const result = followers.map(entry => entry.followerUser);

        return res.status(200).json({
            message: 'Followers retrieved successfully',
            data: result
        })
    } catch (error) {
        console.error('Error fetching followers:', error);
        return res.status(500).json({ 
            message: 'Something went wrong. Please try again later' 
        });
    }
}

exports.removeRelationships = async (req, res) => {
    const user1_id = req.params.id;  
    const { user2_id, actionType } = req.body;  

    try {
        let whereCondition;

        if (actionType === 'following') {
            whereCondition = { user1_id, user2_id }
        } else if (actionType === 'follower') {
            whereCondition = { user1_id: user2_id, user2_id: user1_id }
        } else {
            return res.status(400).json({
                message: 'Invalid action type'
            })
        }

        const relationship = await FollowingUsers.findOne({ where: whereCondition })
        if (!relationship) {
            return res.status(404).json({
                message: `${actionType} relationship not found`
            })
        }

        await FollowingUsers.destroy({ where: whereCondition })

        return res.status(200).json({
            message: `${actionType.charAt(0).toUpperCase() + actionType.slice(1)} relationship deleted successfully.`
        })
    } catch (error) {
        console.error(`Error deleting ${actionType} relationship:`, error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
        });
    }
}