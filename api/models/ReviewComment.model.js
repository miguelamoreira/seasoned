module.exports = (sequelize, DataTypes) => {
    const ReviewComments = sequelize.define('ReviewComments', {
        comment_id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true,
            autoIncrement: true, 
        },
        user_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        review_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        comment: { 
            type: DataTypes.TEXT, 
            allowNull: false 
        },
        comment_date: { 
            type: DataTypes.DATE, 
            defaultValue: DataTypes.NOW 
        },
    },{
        timestamps: false, 
        freezeTableName: true,
    })
    return ReviewComments
}