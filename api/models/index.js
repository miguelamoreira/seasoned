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
db.Genres = require("./Genre.model.js")(sequelize, DataTypes);
db.PreferredGenres = require("./PreferredGenre.model.js")(sequelize, DataTypes);
db.FavouriteSeries = require("./FavouriteSeries.model.js")(sequelize, DataTypes);
db.FollowingUsers = require("./FollowingUsers.model.js")(sequelize, DataTypes);
db.ViewingHistory = require("./ViewingHistory.model.js")(sequelize, DataTypes);
db.Reviews = require("./Reviews.model.js")(sequelize, DataTypes);
db.FollowedSeries = require("./FollowedSeries.model.js")(sequelize, DataTypes);
db.Watchlist = require("./Watchlist.model.js")(sequelize, DataTypes);
db.DroppedSeries = require("./DroppedSeries.model.js")(sequelize, DataTypes);
db.WatchedSeries = require("./WatchedSeries.model.js")(sequelize, DataTypes);
db.SeriesLikes = require("./SeriesLikes.model.js")(sequelize, DataTypes);
db.EpisodeLikes = require("./EpisodeLikes.model.js")(sequelize, DataTypes);
db.SeasonProgress = require("./SeasonProgress.model.js")(sequelize, DataTypes);
db.SeriesProgress = require("./SeriesProgress.model.js")(sequelize, DataTypes);
db.Notifications = require("./Notifications.model.js")(sequelize, DataTypes);
db.NotificationsConfig = require("./NotificationsConfig.model.js")(sequelize, DataTypes)

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
db.ViewingHistory.belongsTo(db.Users, { foreignKey: 'user_id', as: 'user' });

// Users <-> Reviews
db.Users.hasMany(db.Reviews, { foreignKey: 'user_id', as: 'reviews', onDelete: 'CASCADE' });
db.Reviews.belongsTo(db.Users, { foreignKey: 'user_id', as: 'user' });

// Users <-> ReviewComments
db.Users.hasMany(db.ReviewComments, { foreignKey: 'user_id', as: 'comments' });
db.ReviewComments.belongsTo(db.Users, { foreignKey: 'user_id', as: 'user' })

// Users <-> ReviewLikes
db.Users.hasMany(db.ReviewLikes, { foreignKey: 'user_id', as: 'likes' });
db.ReviewLikes.belongsTo(db.Users, { foreignKey: 'user_id', as: 'user' })

// Series <-> Reviews
db.Series.hasMany(db.Reviews, { foreignKey: 'series_api_id', as: 'reviews' });
db.Reviews.belongsTo(db.Series, { foreignKey: 'series_api_id', as: 'series' });

// Episodes <-> Reviews
db.Episodes.hasMany(db.Reviews, { foreignKey: 'episode_api_id', as: 'reviews' });
db.Reviews.belongsTo(db.Episodes, { foreignKey: 'episode_api_id', as: 'episodes' });

// Reviews <-> ReviewComments
db.Reviews.hasMany(db.ReviewComments, { foreignKey: 'review_id', as: 'comments' });
db.ReviewComments.belongsTo(db.Reviews, { foreignKey: 'review_id', as: 'reviews' })

// Reviews <-> ReviewLikes
db.Reviews.hasMany(db.ReviewLikes, { foreignKey: 'review_id', as: 'likes' });
db.ReviewLikes.belongsTo(db.Reviews, { foreignKey: 'review_id', as: 'reviews' })

// Users < FollowedSeries > Series
db.Users.hasMany(db.FollowedSeries, { foreignKey: 'user_id', as: 'followedSeries' });
db.Series.hasMany(db.FollowedSeries, { foreignKey: 'series_api_id', as: 'followedSeries' });

db.FollowedSeries.belongsTo(db.Users, { foreignKey: 'user_id', as: 'user' });
db.FollowedSeries.belongsTo(db.Series, { foreignKey: 'series_api_id', as: 'series' });

// Users < Watchlist > Series
db.Users.hasMany(db.Watchlist, { foreignKey: 'user_id', as: 'watchlist' });
db.Series.hasMany(db.Watchlist, { foreignKey: 'series_api_id', as: 'watchlist' });

db.Watchlist.belongsTo(db.Users, { foreignKey: 'user_id', as: 'user' });
db.Watchlist.belongsTo(db.Series, { foreignKey: 'series_api_id', as: 'series' });

// Users < DroppedSeries > Series
db.Users.hasMany(db.DroppedSeries, { foreignKey: 'user_id', as: 'droppedSeries' });
db.Series.hasMany(db.DroppedSeries, { foreignKey: 'series_api_id', as: 'droppedSeries' });

db.DroppedSeries.belongsTo(db.Users, { foreignKey: 'user_id', as: 'user' });
db.DroppedSeries.belongsTo(db.Series, { foreignKey: 'series_api_id', as: 'series' });

// Users < WatchedSeries > Series
db.Users.hasMany(db.WatchedSeries, { foreignKey: 'user_id', as: 'watchedSeries' });
db.Series.hasMany(db.WatchedSeries, { foreignKey: 'series_api_id', as: 'watchedSeries' });

db.WatchedSeries.belongsTo(db.Users, { foreignKey: 'user_id', as: 'user' });
db.WatchedSeries.belongsTo(db.Series, { foreignKey: 'series_api_id', as: 'series' });

// Series <-> SeriesLikes
db.Series.hasMany(db.SeriesLikes, { foreignKey: 'series_api_id', as: 'seriesLikes' });
db.SeriesLikes.belongsTo(db.Series, { foreignKey: 'series_api_id', as: 'series' });

// Episodes <-> EpisodeLikes
db.Episodes.hasMany(db.EpisodeLikes, { foreignKey: 'episode_api_id', as: 'episodesLikes' });
db.EpisodeLikes.belongsTo(db.Episodes, { foreignKey: 'episode_api_id', as: 'episodes' });

// Series <-> Seasons
db.Series.hasMany(db.Seasons, { foreignKey: 'series_api_id', as: 'seasons', onDelete: 'CASCADE' });
db.Seasons.belongsTo(db.Series, { foreignKey: 'series_api_id', as: 'series' })

// Seasons <-> Episodes
db.Seasons.hasMany(db.Episodes, { foreignKey: 'season_id', as: 'episodes', onDelete: 'CASCADE' });
db.Episodes.belongsTo(db.Seasons, { foreignKey: 'season_id', as: 'seasons' })

module.exports = db;