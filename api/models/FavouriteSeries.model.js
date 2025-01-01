module.exports = (sequelize, DataTypes) => {
    const FavouriteSeries = sequelize.define('FavouriteSeries', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        series_api_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        display_order: {
            type: DataTypes.INTEGER,
            validate: { min: 1, max: 4 },
        }
    },{
        timestamps: false, 
        freezeTableName: true,
    })
    return FavouriteSeries
}