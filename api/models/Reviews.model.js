module.exports = (sequelize, DataTypes) => {
    const Reviews = sequelize.define('Reviews', {
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
        episode_api_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        review_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },{
        timestamps: false, 
        freezeTableName: true,
    })
    return Reviews;
}