module.exports = (sequelize, DataTypes) => {
    const Series = sequelize.define("Series", {
        series_api_id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true 
        },
        title: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },
        description: { 
            type: DataTypes.TEXT 
        },
        release_date: { 
            type: DataTypes.DATE 
        },
        genre: { 
            type: DataTypes.STRING(100) 
        },
        total_seasons: { 
            type: DataTypes.INTEGER 
        },
        average_rating: { 
            type: DataTypes.FLOAT 
        },
        poster_url: { 
            type: DataTypes.TEXT 
        },
    },{
        timestamps: false, 
        freezeTableName: true,
    })
    return Series
}