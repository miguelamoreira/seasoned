const db = require("../models/index.js");
const { ValidationError, Sequelize, where } = require("sequelize");

const Genre = db.Genres;
const PreferredGenres = db.PreferredGenres;

exports.findAllGenres = async (req, res) => {
    try {
        const genres = await Genre.findAll();

        return res.status(200).json({
            message: 'Genres retrieved successfully',
            data: genres,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.'
        })
    }
}

exports.findAllPreferredGenres = async (req, res) => {
    const userId = req.params.id;

    try {
        let preferredGenres = await PreferredGenres.findAll({
            where: { user_id: userId },
            attributes: ['genre_id'],
        });

        if (preferredGenres.length === 0) {
            return res.status(404).json({
                message: 'No preferred genres found for this user.',
            });
        }

        const genreIds = preferredGenres.map(genre => genre.genre_id);
        const genres = await Genre.findAll({
            where: {
                genre_id: genreIds,
            }
        });

        return res.status(200).json({
            message: 'Preferred genres retrieved successfully',
            data: genres,
        });
    } catch (error) {
        console.error('Error getting preferred genres:', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.'
        })
    }
}

exports.addPreferredGenre = async (req, res) => {
    try {
        const genreExists = await Genre.findOne({ where: { genre_id: req.body.genre_id }})

        if (!genreExists) {
            return res.status(400).json({
                message: "Invalid genre",
            });
        }

        const PreferredGenresUser = await PreferredGenres.findOne({ where: { user_id: req.params.id, genre_id: req.body.genre_id }})
        if (PreferredGenresUser) {
            return res.status(400).json({
                msg: "Genre is already added to the user's preferences",
            })
        }

        const newPreferredGenre = await PreferredGenres.create({ user_id: req.params.id, genre_id: req.body.genre_id })

        return res.status(200).json({
            message: 'Genre added successfully',
            data: newPreferredGenre
        })
    } catch (error) {
        console.error('Error adding preferred genre: ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.'
        })
    }
}

exports.deletePreferredGenre = async (req, res) => {
    try {
        const preferredGenre = await PreferredGenres.findOne({ where: { user_id: req.params.id, genre_id: req.body.genre_id }})

        if (!preferredGenre) {
            return res.status(404).json({
                message: "Preferred genre not found for this user"
            })
        }

        await PreferredGenres.destroy({ where: { user_id: req.params.id, genre_id: req.body.genre_id }})

        return res.status(200).json({
            message: "Preferred genre deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting preferred genre: ', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.'
        })
    }
}