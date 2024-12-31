module.exports = (sequelize, DataTypes) => {
    const ReviewLikes = sequelize.define("ReviewLikes", {
        user_id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true 
        },
        review_id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true 
        },
        like_date: { 
            type: DataTypes.DATE, 
            defaultValue: DataTypes.NOW 
        },
    },{
        timestamps: false, 
        freezeTableName: true,
    })
    return ReviewLikes;
}