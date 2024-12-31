module.exports = (sequelize, DataTypes) => {
    const Genres = sequelize.define('Genres', {
        genre_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        genre_name: {
            type: DataTypes.TEXT,
        },
        
    },{
        timestamps: false, 
        freezeTableName: true,
    })
    return Genres
}