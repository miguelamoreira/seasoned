module.exports = (sequelize, DataTypes) => {
    const SeriesLikes = sequelize.define('SeriesLikes', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        series_api_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        like_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
    },{
        timestamps: false, 
        freezeTableName: true,
    })
    return SeriesLikes
}