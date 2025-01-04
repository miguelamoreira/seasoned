module.exports = (sequelize, DataTypes) => {
    const FollowedSeries = sequelize.define('FollowedSeries', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        series_api_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        follow_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },{
        timestamps: false, 
        freezeTableName: true,
    })
    return FollowedSeries
}