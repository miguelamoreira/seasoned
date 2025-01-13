module.exports = (sequelize, DataTypes) => {
    const SeasonProgress = sequelize.define('SeasonProgress', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        season_id: {
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
    return SeasonProgress
}