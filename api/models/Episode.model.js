module.exports = (sequelize, DataTypes) => {
    const Episodes = sequelize.define("Episodes", {
        episode_api_id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true 
        },
        season_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        episode_title: { 
            type: DataTypes.STRING,
        },
        episode_number: { 
            type: DataTypes.INTEGER 
        },
        duration: { 
            type: DataTypes.INTEGER 
        },
        air_date: { 
            type: DataTypes.DATE 
        },
        poster_url: { 
            type: DataTypes.TEXT 
        },
    },{
        timestamps: false, 
        freezeTableName: true,
    })
    return Episodes
}