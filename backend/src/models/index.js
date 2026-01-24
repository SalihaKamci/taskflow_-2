const sequelize = require("../config/database");
const User = require("./user");
const Project = require("./project");
const Task = require("./task");
const File = require("./File")
const Comment = require("./Comment")

//  project- task
Project.hasMany(Task, { foreignKey: "projectId" ,   as: 'tasks', onDelete: 'CASCADE'});
Task.belongsTo(Project, { foreignKey: "projectId" ,  as: 'project' });
//  user-taks assigned
User.hasMany(Task, { foreignKey: "assignedUserId" ,  as: 'assignedTasks'});
Task.belongsTo(User, { foreignKey: "assignedUserId", as: "assignedUser" });
// project-admin
Project.belongsTo(User, {foreignKey: "createdBy",as: "creator",});
User.hasMany(Project, {foreignKey: "createdBy",as: "createdProjects",});

// tasks-admin 
User.hasMany(Task, { foreignKey: "createdBy", as: "createdTasks" });
Task.belongsTo(User, { foreignKey: "createdBy", as: "creator" });


//  avatar
User.hasOne(File, { foreignKey: 'entityId',constraints: false,scope: {entityType: 'user'},as: 'avatar'});

// file-task
Task.hasMany(File, { foreignKey: 'entityId', constraints: false, scope: {entityType: 'task'},as: 'files'});
File.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploader' });

//  commentfile
Comment.hasMany(File, { foreignKey: 'entityId',constraints: false,scope: { entityType: 'comment'},as: 'attachments'});

// Yorumlar
Task.hasMany(Comment, { foreignKey: 'taskId', as: 'comments' });
Comment.belongsTo(Task, { foreignKey: 'taskId', as: 'taskcomment' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });


const db = {};
db.sequelize = sequelize;
db.User = User;
db.Project = Project;
db.Task = Task;
db.File = File;
db.Comment= Comment



module.exports = db;
