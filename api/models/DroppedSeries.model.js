module.exports = (sequelize, DataTypes) => {
    const DroppedSeries = sequelize.define('DroppedSeries', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        series_api_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        drop_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },{
        timestamps: false, 
        freezeTableName: true,
    })
    return DroppedSeries
}