module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        registration_date: {
            type: DataTypes.DATE,
            default: DataTypes.NOW,
        },
        total_time_spent: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        badges_visibility: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
    },{
        timestamps: false, 
        freezeTableName: true,
    })
    return Users;
}

