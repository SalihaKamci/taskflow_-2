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
    type: DataTypes.ENUM("critical", "high", "medium", "low"),  
    defaultValue: "low",
},
 dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        isAfterCurrentDate(value) {
          if (new Date(value) < new Date()) {
            throw new Error('Due date must be in the future');
          }
        }
      }
    },
        assignedUserId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            },
             onDelete: 'SET NULL'
        },
          projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id'
      },
      onDelete: 'CASCADE' 
    },
       createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
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