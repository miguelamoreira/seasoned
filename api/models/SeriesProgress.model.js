module.exports = (sequelize, DataTypes) => {
    const SeriesProgress = sequelize.define('SeriesProgress', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        series_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        progress_percentage: {
            type: DataTypes.INTEGER,
            validate: { min: 0, max: 100 },
        }
    },{
        timestamps: false, 
        freezeTableName: true,
    })
    return SeriesProgress
}