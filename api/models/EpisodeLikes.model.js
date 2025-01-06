module.exports = (sequelize, DataTypes) => {
    const EpisodeLikes = sequelize.define('EpisodeLikes', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        episode_api_id: {
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
    return EpisodeLikes
}