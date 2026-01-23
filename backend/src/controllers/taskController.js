const { Task, Project, User } = require("../models");
const { TASK_STATUS, USER_ROLES } = require("../constants");

const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            projectId,
            assignedUserId,
            dueDate,
            priority,
        } = req.body;
   console.log("Gelen veri:", req.body);

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
            dueDate,
            priority: ["low", "medium", "high"].includes(priority) ? priority : "medium",
          status: assignedUserId ? TASK_STATUS.TODO : TASK_STATUS.ON_HOLD,
            createdBy: req.user.id
        });


        const createdTask = await Task.findByPk(task.id, {
            include: [
                {
                    model: Project,
                    as: 'project',
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
         console.error("Task creation error:", error);
        res.status(500).json({ message: "Task creation error", error });
    }
};

const updateTaskStatus  = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        

        if (!status || !Object.values(TASK_STATUS).includes(status)) {
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
   if (req.user.role !== USER_ROLES.EMPLOYEE) {
      return res.status(403).json({ 
        message: "You are not authorized to update this task" 
      });
    }
  if (task.assignedUserId !== req.user.id) {
            return res.status(403).json({ 
                message: "You can only update your own tasks" 
            });
        }
        const oldStatus = task.status;
         task.status = status;
        await task.save();
       
           const updatedTask = await Task.findByPk(id, {
      include: [
        { 
          model: Project, 
            as: 'project',
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
     updatedBy: "employee"
      }
    });
    } catch (error) {
         console.error("Update task status error:", error);
        res.status(500).json({ message:"Failed to update task status", error });
    }
};
const getAllTasks = async (req, res) => {
    try {
        let where = {};

       
        if (req.user.role === USER_ROLES.EMPLOYEE) {
           
            where.assignedUserId = req.user.id;
        }  else  if (req.user.role === USER_ROLES.ADMIN) {
              
           
            where.createdBy = req.user.id;  
        }

      
        const tasks = await Task.findAll({
            where,
            include: [
                { 
                    model: Project, 
                    as: 'project',
                    attributes: ["id", "name"] 
                },
                { 
                    model: User, 
                    as: "assignedUser", 
                    attributes: ["id", "fullName", "email"] 
                },
                { 
                    model: User, 
                    as: "creator", 
                    attributes: ["id", "fullName", "email"] 
                }
            ],
            order: [["dueDate", "ASC"]],
        });

        res.json(tasks);
    } catch (error) {
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
           as: 'project',
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
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            projectId,
            assignedUserId,
            dueDate,
            priority,
            status
        } = req.body;

        console.log("Update task request:", { id, body: req.body });

  
        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

      
        if (req.user.role !== USER_ROLES.ADMIN && task.createdBy !== req.user.id) {
            return res.status(403).json({ 
                message: "You are not authorized to update this task" 
            });
        }

   
        if (projectId && projectId !== task.projectId) {
            const project = await Project.findByPk(projectId);
            if (!project) {
                return res.status(404).json({ message: "Project not found" });
            }
        }

   
        if (assignedUserId && assignedUserId !== task.assignedUserId) {
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

    
        await task.update({
            title: title || task.title,
            description: description !== undefined ? description : task.description,
            projectId: projectId || task.projectId,
            assignedUserId: assignedUserId !== undefined ? assignedUserId : task.assignedUserId,
            dueDate: dueDate || task.dueDate,
            priority: priority || task.priority,
            status: status || task.status
        });

        const updatedTask = await Task.findByPk(id, {
            include: [
                {
                    model: Project,
                    as: 'project',
                    attributes: ['id', 'name', 'status']
                },
                {
                    model: User,
                    as: "assignedUser",
                    attributes: ["id", "fullName", "email"]
                },
                {
                    model: User,
                    as: "creator",
                    attributes: ["id", "fullName", "email"]
                }
            ]
        });

        res.json({
            message: "Task updated successfully",
            task: updatedTask
        });
    } catch (error) {
        console.error("Update task error:", error);
        res.status(500).json({ 
            message: "Failed to update task", 
            error: error.message 
        });
    }
};
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;


    const task = await Task.findByPk(id, {
      include: [
        { 
          model: Project, 
          as: 'project',
          attributes: ['id', 'name'] 
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }


    const isAdmin = req.user.role === USER_ROLES.ADMIN;
    const isCreator = task.createdBy === req.user.id;
    
    if (!isAdmin && !isCreator) {
      return res.status(403).json({ 
        message: "You are not authorized to delete this task. Only admins or the task creator can delete tasks." 
      });
    }


 
    await task.destroy();

    res.json({
      message: "Task deleted successfully",
      deletedTask: {
        id: task.id,
        title: task.title,
        project: task.project ? task.project.name : null,
        status: task.status,
        deletedBy: req.user.role,
        deletedAt: new Date()
      }
    });

  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ 
      message: "Failed to delete task", 
      error: error.message 
    });
  }
};
module.exports = {
    createTask,
updateTaskStatus,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
};
