module.exports = (sequelize, DataTypes) => {
    const NotificationsConfig = sequelize.define("NotificationsConfig", {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        earnedBadges: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        newFollowers: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        newComments: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        newLikes: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        upcomingEpisodes: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        seasonEpisodes: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    }, {
        timestamps: false,
        freezeTableName: true
    })

    return NotificationsConfig
}