const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Task = sequelize.define(
    "Task",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        description: {
            type: DataTypes.TEXT,
        },

        status: {
            type: DataTypes.ENUM(
                "Todo",
                "In_progress",
                "Completed",
                "On_hold",
                "Blocked"
            ),
            defaultValue: "Todo",
        },

        priority: {
            type: DataTypes.ENUM("Critical", "High", "Medium", "Low"),
            defaultValue: "Low",
        },

        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },

        endDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        assignedUserId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            }
        },
    },
    {
        tableName: "tasks",
        timestamps: true,
    }
);

module.exports = Task;