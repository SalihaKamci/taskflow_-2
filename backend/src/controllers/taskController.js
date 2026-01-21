const { Task, Project, User } = require("../models");
const { TASK_STATUS, USER_ROLES } = require("../constants");

const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            projectId,
            assignedUserId,
            startDate,
            endDate,
            priority,
        } = req.body;


        if (!title || !projectId) {
            return res.status(400).json({
                message: "Title and projectId are required"
            });
        }


        const project = await Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }


        if (assignedUserId) {
            const user = await User.findOne({
                where: {
                    id: assignedUserId,
                    role: USER_ROLES.EMPLOYEE
                }
            });
            if (!user) {
                return res.status(404).json({
                    message: "Assigned employee not found"
                });
            }
        }
        const task = await Task.create({
            title,
            description: description,
            projectId,
            assignedUserId: assignedUserId,
            startDate,
            endDate,
            priority: ["low", "medium", "high"].includes(priority) ? priority : "medium",
            status: assignedUserId ? TASK_STATUS.PENDING : TASK_STATUS.ON_HOLD,
            createdBy: req.user.id
        });


        const createdTask = await Task.findByPk(task.id, {
            include: [
                {
                    model: Project,
                    attributes: ['id', 'name', 'status']
                },
                {
                    model: User,
                    as: "assignedUser",
                    attributes: ["id", "fullName", "email"]
                }
            ]
        });


        res.status(201).json({
            message: "Task created successfully",
            task: createdTask
        });
    } catch (error) {
        res.status(500).json({ message: "Task creation error", error });
    }
};

const updateTaskStatus  = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        

        if (!allStatuses || !Object.values(TASK_STATUS).includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const task = await Task.findByPk(id, {
      include: [
        { 
          model: User, 
          as: "assignedUser", 
          attributes: ["id", "fullName"] 
        }
      ]
    });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
if (!isAdmin && !isAssignedEmployee) {
      return res.status(403).json({ 
        message: "You are not authorized to update this task" 
      });
    }

        task.status = status;
        await task.save();
           const updatedTask = await Task.findByPk(id, {
      include: [
        { 
          model: Project, 
          attributes: ['id', 'name'] 
        },
        { 
          model: User, 
          as: "assignedUser", 
          attributes: ["id", "fullName"] 
        }
      ]
    });

       res.json({
      message: "Task status updated successfully",
      task: updatedTask,
      statusChange: {
        from: oldStatus,
        to: status,
        updatedBy: isAdmin ? "admin" : "employee"
      }
    });
    } catch (error) {
         console.error("Update task status error:", error);
        res.status(500).json({ message:"Failed to update task status", error });
    }
};

const getAllTasks = async (req, res) => {
    try {
        const {
            assignedUserId,
        } = req.query;

        const where = {};

        if (req.user.role === USER_ROLES.EMPLOYEE) {
            where.assignedUserId = req.user.id;
        } else if (assignedUserId) {
            where.assignedUserId = assignedUserId;
        }

        const tasks = await Task.findAll({
            where,
            include: [
                { model: Project, attributes: ["id", "name"] },
                { model: User, as: "assignedUser", attributes: ["id", "fullName"] },
                { model: User, as: "creator", attributes: ["id", "fullName"] }
            ],
            order: [["dueDate", "ASC"]],
        });

        res.json(tasks);
    }catch (error) {
        console.error("Get tasks error:", error);
        res.status(500).json({
            message: "Failed to retrieve tasks",
            error: error.message
        });
    }
};
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id, {
      include: [
        { 
          model: Project, 
          attributes: ['id', 'name', 'description', 'status'] 
        },
        { 
          model: User, 
          as: "assignedUser", 
          attributes: ["id", "fullName", "email"] 
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "fullName"]
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isAdmin = req.user.role === USER_ROLES.ADMIN;
    const isAssignedEmployee = task.assignedUserId === req.user.id;
    const isCreator = task.createdBy === req.user.id;
    
    if (!isAdmin && !isAssignedEmployee && !isCreator) {
      return res.status(403).json({ 
        message: "You are not authorized to view this task" 
      });
    }

    res.json({ task });

  } catch (error) {
    console.error("Get task by ID error:", error);
    res.status(500).json({ 
      message: "Failed to retrieve task", 
      error: error.message 
    });
  }
};
module.exports = {
    createTask,
updateTaskStatus,
    getAllTasks,
    getTaskById
};
