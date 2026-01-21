const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Project = sequelize.define(
    "Project",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },

        description: {
            type: DataTypes.TEXT,
        },

status: {
    type: DataTypes.ENUM("Active", "Completed", "On Hold"),
    defaultValue: "Active",
    validate: {
        isIn: [["Active", "Completed", "On Hold"]]
    }
},
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Users",
                key: "id",
            },
        },

    },
    {
        tableName: "projects",
        timestamps: true,
    }
);

module.exports = Project;