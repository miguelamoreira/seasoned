const db = require("../models/index.js");
const { ValidationError, Sequelize, where } = require("sequelize");

const Genre = db.Genres;

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