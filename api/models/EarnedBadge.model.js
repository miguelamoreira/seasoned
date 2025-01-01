module.exports = (sequelize, DataTypes) => {
    const EarnedBadges = sequelize.define("EarnedBadges", {
        user_id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true 
        },
        badge_id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true 
        },
        earned_date: { 
            type: DataTypes.DATE, 
            defaultValue: DataTypes.NOW 
        },
    },{
        timestamps: false, 
        freezeTableName: true,
    })

    return EarnedBadges
}