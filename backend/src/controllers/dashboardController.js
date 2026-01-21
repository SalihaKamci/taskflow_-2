const { Project, Task, User } = require("../models");
const { Op } = require("sequelize");
const { TASK_STATUS ,USER_ROLES  } = require("../constants");

const getDashboardStats  = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const endOfWeek = new Date();
    endOfWeek.setDate(today.getDate() + 7);
 
     if(userRole === USER_ROLES.ADMIN){
          const [
        totalProjects,
        totalTasks,
        totalEmployees,
        todayTasks,
        weeklyTasks,
        overdueTasks,
        pendingTasks,
        onHoldTasks,
        inProgressTasks,
        completedTasks
      ] = await Promise.all([
       
        Project.count({ where: { createdBy: userId } }),
        Task.count(),
        User.count({ where: { role: USER_ROLES.EMPLOYEE } }),
        Task.count({
          where: {
            dueDate: { [Op.between]: [today, endOfToday] },
            status: { [Op.ne]: TASK_STATUS.COMPLETED }
          }
        }),
        
        Task.count({
          where: {
            dueDate: { [Op.between]: [today, endOfWeek] },
            status: { [Op.ne]: TASK_STATUS.COMPLETED }
          }
        }),
        
        Task.count({
          where: {
            dueDate: { [Op.lt]: today },
            status: { [Op.ne]: TASK_STATUS.COMPLETED }
          }
        }),
        Task.count({ where: { status: TASK_STATUS.PENDING } }),
        Task.count({ where: { status: TASK_STATUS.ON_HOLD } }),
        Task.count({ where: { status: TASK_STATUS.IN_PROGRESS } }),
        Task.count({ where: { status: TASK_STATUS.COMPLETED } })
      ]);

     
      res.json({
        role: "admin",
        totals: {
          projects: totalProjects,
          tasks: totalTasks,
          employees: totalEmployees
        },
        taskStats: {
          today: todayTasks,
          weekly: weeklyTasks,
          overdue: overdueTasks,
          pending: pendingTasks,
          onHold: onHoldTasks,
          inProgress: inProgressTasks,
          completed: completedTasks
        },
      });

    } else {
         const [
        totalTasks,
        todayTasks,
        weeklyTasks,
        overdueTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        projectCount
      ] = await Promise.all([
        Task.count({ where: { assignedUserId: userId } }),
        Task.count({
          where: {
            assignedUserId: userId,
            dueDate: { [Op.between]: [today, endOfToday] },
            status: { [Op.ne]: TASK_STATUS.COMPLETED }
          }
        }),
        Task.count({
          where: {
            assignedUserId: userId,
            dueDate: { [Op.between]: [today, endOfWeek] },
            status: { [Op.ne]: TASK_STATUS.COMPLETED }
          }
        }),
        Task.count({
          where: {
            assignedUserId: userId,
            dueDate: { [Op.lt]: today },
            status: { [Op.ne]: TASK_STATUS.COMPLETED }
          }
        }),
        
        Task.count({
          where: {
            assignedUserId: userId,
            status: TASK_STATUS.PENDING
          }
        }),
        Task.count({
          where: {
            assignedUserId: userId,
            status: TASK_STATUS.IN_PROGRESS
          }
        }),
        
        Task.count({
          where: {
            assignedUserId: userId,
            status: TASK_STATUS.COMPLETED
          }
        }),
        
        Project.count({
          include: [
            {
              association: "tasks",
              where: { assignedUserId: userId }
            }
          ],
          distinct: true
        })
      ]);

      const upcomingTasks = await Task.findAll({
        where: {
          assignedUserId: userId,
          dueDate: { 
            [Op.between]: [today, new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)] 
          },
          status: { [Op.ne]: TASK_STATUS.COMPLETED }
        },
        include: [
          { 
            model: Project, 
            attributes: ["id", "name"] 
          }
        ],
        order: [["dueDate", "ASC"]],
        limit: 5,
        attributes: ["id", "title", "dueDate", "priority", "status"]
      });

      res.json({
        role: "employee",
        totals: {
          tasks: totalTasks,
          projects: projectCount
        },
        taskStats: {
          today: todayTasks,
          weekly: weeklyTasks,
          overdue: overdueTasks,
          pending: pendingTasks,
          inProgress: inProgressTasks,
          completed: completedTasks
        },
        upcomingTasks
      });
    }

      } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      message: "Dashboard data could not be retrieved",
      error: error.message
    });
  }
};
   
   

module.exports = {getDashboardStats};