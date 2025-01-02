module.exports = (sequelize, DataTypes) => {
    const ViewingHistory = sequelize.define('ViewingHistory', {
        history_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
        },
        series_api_id: {
            type: DataTypes.INTEGER,
        },
        episode_api_id: {
            type: DataTypes.INTEGER,
        },
        watch_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        time_watched: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        episode_progress: {
            type: DataTypes.INTEGER,
            validate: { min: 0, max: 100 }
        }
    },{
        timestamps: false, 
        freezeTableName: true,
    })
    return ViewingHistory
}