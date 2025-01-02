const db = require("../models/index.js");
const { ValidationError, Sequelize, where } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWTconfig } = require("../config/db.config.js");
require("dotenv").config();

const Users = db.Users;
const Genres = db.Genres;
const PreferredGenres = db.PreferredGenres;
const FollowingUsers = db.FollowingUsers;
const ViewingHistory = db.ViewingHistory;

const cloudinary = require('../config/cloudinary.config.js');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                message: 'Please provide email and password'
            })
        }

        const user = await Users.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ 
                message: 'User not found' 
            })
        }

        const passwordMatch = await bcrypt.compare(password.trim(), user.password);

        if (!passwordMatch) {
            return res.status(401).json({ 
                message: 'Invalid credentials' 
            })
        }

        const token = jwt.sign({ id: user.user_id }, JWTconfig.SECRET, { expiresIn: "2h" });

        return res.status(200).json({
            loggedUserId: user.user_id,
            success: true,
            accessToken: token,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.'
        })
    }
}

exports.create = async (req, res) => {
    const { name, email, password, confirmPassword, preferredGenres } = req.body;

    try {
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                message: 'Please provide name, email and password'
            })
        }

        const existingUser = await Users.findOne({ where: { email } });

        if (existingUser) {
            return res.status(409).json({
                message: 'User already registered!'
            })
        }
        
        let userNew = await Users.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
            registration_date: Date.now(),
        });

        if (preferredGenres && preferredGenres.length > 0) {
            const genresData = preferredGenres.map(genreId => ({
                user_id: userNew.user_id,
                genre_id: genreId,
            }));
            await PreferredGenres.bulkCreate(genresData);
        }

        return res.status(201).json({
            message: 'User created successfully',
            user: userNew, 
        })
    } catch (error) {
        console.error('Error during user creation:', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.'
        })
    }
}

exports.findOne = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await Users.findByPk(userId, {
            include: [
                {
                    model: FollowingUsers,
                    as: 'followings', 
                    attributes: ['user1_id'],
                    include: {
                        model: Users,
                        as: 'followingUser',
                        attributes: ['user_id', 'name', 'avatar']
                    }
                },
                {
                    model: FollowingUsers,
                    as: 'followers', 
                    attributes: ['user2_id'],
                    include: {
                        model: Users,
                        as: 'followerUser',
                        attributes: ['user_id', 'name', 'avatar']
                    }
                },
                {
                    model: ViewingHistory,
                    as: 'viewingHistory', 
                    attributes: ['series_api_id', 'episode_api_id', 'watch_date', 'time_watched', 'episode_progress']
                }
            ]
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const viewingHistory = Array.isArray(user.viewingHistory) ? user.viewingHistory : [];

        const formattedUser = {
            id: user.user_id,
            username: user.name,
            avatar: user.avatar,
            followers: user.followers.length,
            following: user.followings.length,
            statsData: {
                episodes: viewingHistory.length,
                months: Math.floor(user.total_time_spent / 30),
                weeks: Math.floor(user.total_time_spent / 7),
                days: Math.floor(user.total_time_spent / 24),
                thisYearEpisodes: viewingHistory.filter(history => new Date(history.watch_date).getFullYear() === new Date().getFullYear()).length
            }
        };

        return res.status(200).json({
            message: 'User retrieved successfully',
            data: formattedUser
        });

    } catch (error) {
        console.error('Error fetching user: ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.'
        });
    }
};


exports.updateUsername = async (req, res) => {
    const userId = req.params.id;
    const { name } = req.body;
    
    try {
        if (!name) {
            return
        }

        let user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        user.name = name;
        user.save();

        return res.status(200).json({
            message: 'Username updated sucessfully',
            data: user
        })
    } catch (error) {
        console.error('Error updating username:', error);
        return res.status(500).json({ 
            message: "Something went wrong. Please try again later" 
        }); 
    }
}

exports.updateData = async (req, res) => {
    const userId = req.params.id;
    const { email, currentPassword, newPassword, confirmNewPassword } = req.body;

    try {
        if (!email || !currentPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({ 
                message: "Please provide some data." 
            });
        }

        let user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ 
                message: `User not found` 
            });
        }

        const passwordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatch) {
            return res.status(400).json({
                message: 'Current password is incorrect',
            });
        }

        user.email = email;

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                message: 'New password and confirmation password do not match',
            });
        }

        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
        }

        await user.save();

        return res.status(200).json({ 
            message: `User data updated successfully` 
        });
    } catch (err) {
        return res.status(500).json({ 
            message: "Something went wrong. Please try again later" 
        });
    }
};

exports.updateAvatar = async (req, res) => {
    const userId = req.params.id;
    const avatar = req.file;

    try {
        let user = await Users.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!avatar) {
            return res.status(400).json({ 
                message: 'No file uploaded' 
            });
        }

        const b64 = Buffer.from(avatar.buffer).toString("base64");
        let dataURI = "data:" + avatar.mimetype + ";base64," + b64;

        const uploadResult = await cloudinary.uploader.upload(dataURI, {
            folder: 'seasoned', 
            resource_type: 'auto', 
        });

        user.avatar = uploadResult.secure_url;

        await user.save();
        return res.status(200).json({ 
            message: `User's avatar updated successfully.`,
            data: user.avatar
        });
    } catch (error) {
        console.error('error: ', error)
        return res.status(500).json({ 
            message: "Something went wrong. Please try again later" 
        });
    }
};