module.exports = (sequelize, DataTypes) => {
    const SeriesReviews = sequelize.define('SeriesReviews', {
        review_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        series_api_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        comment: {
            type: DataTypes.TEXT,
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1, max: 5 }
        },
        reviewDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },{
        timestamps: false, 
        freezeTableName: true,
    })
    return SeriesReviews;
}