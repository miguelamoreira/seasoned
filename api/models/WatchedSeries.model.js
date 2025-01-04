module.exports = (sequelize, DataTypes) => {
    const WatchedSeries = sequelize.define('WatchedSeries', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        series_api_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        watched_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },{
        timestamps: false, 
        freezeTableName: true,
    })
    return WatchedSeries
}