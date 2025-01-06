module.exports = (sequelize, DataTypes) => {
    const Seasons = sequelize.define("Seasons", {
        season_id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true,
        },
        series_api_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        season_number: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        episode_ids: { 
            type: DataTypes.TEXT, 
            allowNull: true 
        },
    },{
        timestamps: false, 
        freezeTableName: true,
    })
    return Seasons
}