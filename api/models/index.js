const config = require('../config/db.config.js');
const dbConfig=config.dbConfig
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    },
    dialectOptions: dbConfig.dialectOptions,
    logging: console.log
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
        process.exit(1);
    }
})();

const db = {};

db.sequelize = sequelize;
db.Users = require("./Users.model.js")(sequelize, DataTypes);
db.Badges = require("./Badge.model.js")(sequelize, DataTypes);
db.EarnedBadges = require("./EarnedBadge.model.js")(sequelize, DataTypes);
db.Episodes = require("./Episode.model.js")(sequelize, DataTypes);
db.ReviewComments = require("./ReviewComment.model.js")(sequelize, DataTypes);
db.ReviewLikes = require("./ReviewLike.model.js")(sequelize, DataTypes);
db.Seasons = require("./Season.model.js")(sequelize, DataTypes);
db.Series = require("./Series.model.js")(sequelize, DataTypes);
db.SeriesReviews = require("./SeriesReview.model.js")(sequelize, DataTypes);
db.Genres = require("./Genre.model.js")(sequelize, DataTypes);
db.PreferredGenres = require("./PreferredGenre.model.js")(sequelize, DataTypes);
db.FavouriteSeries = require("./FavouriteSeries.model.js")(sequelize, DataTypes);
db.FollowingUsers = require("./FollowingUsers.model.js")(sequelize, DataTypes);
db.ViewingHistory = require("./ViewingHistory.model.js")(sequelize, DataTypes);

// Users < EarnedBadges > Badges
db.Users.hasMany(db.EarnedBadges, { foreignKey: 'user_id', as: 'earnedBadges' });

db.Badges.hasMany(db.EarnedBadges, { foreignKey: 'badge_id', as: 'earnedBadges' });

db.EarnedBadges.belongsTo(db.Users, { foreignKey: 'user_id', as: 'user' });
db.EarnedBadges.belongsTo(db.Badges, { foreignKey: 'badge_id', as: 'badge' });

// Users < FavouriteSeries > Series
db.Users.hasMany(db.FavouriteSeries, { foreignKey: 'user_id', as: 'favouriteSeries' });

db.Series.hasMany(db.FavouriteSeries, { foreignKey: 'series_api_id', as: 'favouriteSeries' });

db.FavouriteSeries.belongsTo(db.Users, { foreignKey: 'user_id', as: 'user' });
db.FavouriteSeries.belongsTo(db.Series, { foreignKey: 'series_api_id', as: 'series' });

// Users < PreferredGenres > Genres
db.Users.hasMany(db.PreferredGenres, { foreignKey: 'user_id', as: 'preferredGenres' });

db.Genres.hasMany(db.PreferredGenres, { foreignKey: 'genre_id', as: 'preferredGenres' })

db.PreferredGenres.belongsTo(db.Users, { foreignKey: 'user_id', as: 'user' });
db.PreferredGenres.belongsTo(db.Genres, { foreignKey: 'genre_id', as: 'genres' });

// Users <-> FollowingUsers (following)
db.Users.hasMany(db.FollowingUsers, { foreignKey: 'user1_id', as: 'followings' });
db.FollowingUsers.belongsTo(db.Users, { foreignKey: 'user2_id', as: 'followingUser' });

// Users <-> FollowingUsers (followers)
db.Users.hasMany(db.FollowingUsers, { foreignKey: 'user2_id', as: 'followers' });
db.FollowingUsers.belongsTo(db.Users, { foreignKey: 'user1_id', as: 'followerUser' });

// Users <-> ViewingHistory
db.Users.hasOne(db.ViewingHistory, { foreignKey: 'user_id', as: 'viewingHistory', onDelete: 'CASCADE' });
db.ViewingHistory.belongsTo(db.Users, { foreignKey: 'users_id', as: 'user' });

module.exports = db;