module.exports = (sequelize, DataTypes) => {
    const Seasons = sequelize.define("Seasons", {
        season_id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true,
            autoIncrement: true, 
        },
        series_api_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        season_number: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        season_title: { 
            type: DataTypes.STRING, 
        },
    },{
        timestamps: false, 
        freezeTableName: true,
    })
    return Seasons
}