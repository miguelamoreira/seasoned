module.exports = (sequelize, DataTypes) => {
    const FollowingUsers = sequelize.define('Following', {
        user1_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        user2_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        following_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
    },{
        timestamps: false, 
        freezeTableName: true,
    })
    return FollowingUsers
}