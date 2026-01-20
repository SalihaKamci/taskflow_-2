const sequelize = require("../config/database");
const User = require("./user");
const Project = require("./project");
const Task = require("./task");

Project.hasMany(Task, { foreignKey: "projectId" });
Task.belongsTo(Project, { foreignKey: "projectId" });
User.hasMany(Task, { foreignKey: "assignedUserId" });
Task.belongsTo(User, { foreignKey: "assignedUserId", as: "assignedUser" });
Project.belongsTo(User, {foreignKey: "createdBy",as: "creator",});
User.hasMany(Project, {foreignKey: "createdBy",as: "createdProjects",});

const db = {};
db.sequelize = sequelize;
db.User = User;
db.Project = Project;
db.Task = Task;



module.exports = db;
