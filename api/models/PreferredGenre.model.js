module.exports = (sequelize, DataTypes) => {
    const PreferredGenres = sequelize.define('PreferredGenres', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        genre_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        }
    },{
        timestamps: false, 
        freezeTableName: true,
    })
    return PreferredGenres
}