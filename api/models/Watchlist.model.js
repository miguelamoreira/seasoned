module.exports = (sequelize, DataTypes) => {
    const Watchlist = sequelize.define('Watchlist', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        series_api_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
    },{
        timestamps: false, 
        freezeTableName: true,
    })
    return Watchlist
}