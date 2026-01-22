const sequelize = require("../config/database");
const User = require("./user");
const Project = require("./project");
const Task = require("./task");

//  project- task
Project.hasMany(Task, { foreignKey: "projectId" ,  onDelete: 'CASCADE'});
Task.belongsTo(Project, { foreignKey: "projectId" });
//  user-taks assigned
User.hasMany(Task, { foreignKey: "assignedUserId" ,  as: 'assignedTasks'});
Task.belongsTo(User, { foreignKey: "assignedUserId", as: "assignedUser" });
// project-admin
Project.belongsTo(User, {foreignKey: "createdBy",as: "creator",});
User.hasMany(Project, {foreignKey: "createdBy",as: "createdProjects",});

// tasks-admin 
User.hasMany(Task, { foreignKey: "createdBy", as: "createdTasks" });
Task.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

const db = {};
db.sequelize = sequelize;
db.User = User;
db.Project = Project;
db.Task = Task;



module.exports = db;
