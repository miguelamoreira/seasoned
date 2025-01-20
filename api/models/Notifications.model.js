module.exports = (sequelize, DataTypes) => {
    const Notifications = sequelize.define("Notifications", {
        notification_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
        },
        notificationType: {
            type: DataTypes.ENUM('activity', 'new releases'),
        },
        variant: {
            type: DataTypes.ENUM('earnedBadges', 'newFollowers', 'newComments', 'newLikes', 'upcomingEpisodes', 'seasonPremieres'),
        },
        message: {
            type: DataTypes.TEXT,
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        review_id: {
            type: DataTypes.INTEGER,
            defaultValue: null,
        },
        comment_id: {
            type: DataTypes.INTEGER,
            defaultValue: null,
        },
    }, {
        timestamps: false,
        freezeTableName: true,
    });

    return Notifications;
}