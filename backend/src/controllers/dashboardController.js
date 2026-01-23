const { Project, Task, User } = require("../models");
const { Op , Sequelize} = require("sequelize");
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
        todoTasks,    
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
        Task.count({ where: { status: TASK_STATUS.TODO } }),
        Task.count({ where: { status: TASK_STATUS.ON_HOLD } }),
        Task.count({ where: { status: TASK_STATUS.IN_PROGRESS } }),
        Task.count({ where: { status: TASK_STATUS.COMPLETED } })
      ]);
     const overdueTasksList = await Task.findAll({
        where: {
          dueDate: { [Op.lt]: today },
          status: { [Op.ne]: TASK_STATUS.COMPLETED }
        },
        include: [
          { 
            model: Project, 
            as:"project",
            attributes: ["id", "name"] 
          },
          { 
            model: User, 
            as: "assignedUser",
            attributes: ["id", "fullName", "email"] 
          }
        ],
        order: [["dueDate", "ASC"]],
        attributes: ["id", "title", "dueDate", "priority", "status", "description"]
      });
        const projectCompletionRates = await Project.sequelize.query(`
        SELECT 
          p.id,
          p.name,
          COUNT(t.id) as totalTasks,
          SUM(CASE WHEN t.status IN ('Completed', 'completed') THEN 1 ELSE 0 END) as completedTasks
        FROM projects p
        LEFT JOIN tasks t ON p.id = t.projectId
        WHERE p.createdBy = :userId
        GROUP BY p.id, p.name
        ORDER BY p.createdAt DESC
      `, {
        replacements: { userId: userId },
        type: Project.sequelize.QueryTypes.SELECT
      });

      const formattedCompletionRates = projectCompletionRates.map(row => {
        const total = parseInt(row.totalTasks) || 0;
        const completed = parseInt(row.completedTasks) || 0;
        const completionRate = total > 0
          ? Math.round((completed / total) * 100)
          : 0;

        return {
          id: row.id,
          name: row.name,
          totalTasks: total,
          completedTasks: completed,
          completionRate: completionRate
        };
      }).sort((a, b) => b.completionRate - a.completionRate);


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
          pending:    todoTasks,  
          onHold: onHoldTasks,
          inProgress: inProgressTasks,
          completed: completedTasks
        },
   projectCompletionRates: formattedCompletionRates,
         overdueTasksList: overdueTasksList
      });

    } else {
         const [
        totalTasks,
        todayTasks,
        weeklyTasks,
        overdueTasks,
           todoTasks, 
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
            status: TASK_STATUS.TODO
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
          pending: todoTasks, 
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