const { Project, Task } = require("../models");
const {PROJECT_STATUS} = require("../constants");

const createProject = async (req, res) => {
  try {
    const { name, description, status = PROJECT_STATUS.ACTIVE } = req.body;

    const project = await Project.create({
      name,
      description,
      status: Object.values(PROJECT_STATUS).includes(status) ? status : PROJECT_STATUS.ACTIVE,
      createdBy: req.user.id
    });

    res.status(201).json({ 
      message: "Project created successfully", 
      project 
    });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ 
      message: "Project creation error", 
      error: error.message 
    });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const where = req.user.role === "admin" 
      ? {} 
      : { createdBy: req.user.id };

    const projects = await Project.findAll({
      where,
      include: [{
        model: Task,
        as: 'tasks',
        attributes: ['id']
      }],
      order: [["createdAt", "DESC"]]
    });

    const projectsWithTaskCount = projects.map(project => {
      const projectData = project.toJSON();
      return {
        ...projectData,
        taskCount: projectData.tasks ? projectData.tasks.length : 0
      };
    });
    
    res.json(projectsWithTaskCount);
  } catch (error) {
    console.error("Get all projects error:", error);
    res.status(500).json({ 
      message: "Projects not loaded", 
      error: error.message 
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const where = req.user.role === "admin" 
      ? { id } 
      : { id, createdBy: req.user.id };

    const project = await Project.findOne({ 
      where,
      include: [{
        model: Task,
        as: 'tasks',
        attributes: ['id', 'title', 'status', 'priority', 'dueDate', 'description', 'assignedUserId']
      }]
    });
    
    if (!project) {
      return res.status(404).json({ 
        message: "Project not found" 
      });
    }
    
    res.json(project);
  } catch (error) {
    console.error("Get project by id error:", error);
    res.status(500).json({ 
      message: "Error loading project", 
      error: error.message 
    });
  }
};

const getProjectTasks = async (req, res) => {
  try {
    const { id } = req.params;
    const projectWhere = req.user.role === "admin" 
      ? { id } 
      : { id, createdBy: req.user.id };

    const project = await Project.findOne({ 
      where: projectWhere 
    });
    
    if (!project) {
      return res.status(404).json({ 
        message: "Project not found" 
      });
    }

    const tasks = await Task.findAll({
      where: { projectId: id },
      order: [["createdAt", "DESC"]]
    });
    
    res.json(tasks);
  } catch (error) {
    console.error("Get project tasks error:", error);
    res.status(500).json({ 
      message: "Error loading tasks", 
      error: error.message 
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    console.log("Update project request:", { id, body: req.body, user: req.user });

    
    const where = req.user.role === "admin" 
      ? { id } 
      : { id, createdBy: req.user.id };

    const project = await Project.findOne({ where });
    
    if (!project) {
      console.log("Project not found:", { id, where });
      return res.status(404).json({ 
        message: "Project not found" 
      });
    }


    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined && Object.values(PROJECT_STATUS).includes(status)) {
      updateData.status = status;
    }

    console.log("Updating project with data:", updateData);

    await project.update(updateData);
    

    const updatedProject = await Project.findByPk(id, {
      include: [{
        model: Task,
        as: 'tasks',
        attributes: ['id', 'title', 'status', 'priority', 'dueDate']
      }]
    });
    
    res.json({ 
      message: "Project updated successfully", 
      project: updatedProject 
    });
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({ 
      message: "Error updating project", 
      error: error.message 
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ 
        message: "Access denied. Admin only." 
      });
    }
    
    const { id } = req.params;
    
    const project = await Project.findByPk(id);
    
    if (!project) {
      return res.status(404).json({ 
        message: "Project not found" 
      });
    }

    await project.destroy();
    
    res.json({ 
      message: "Project deleted successfully" 
    });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ 
      message: "Error deleting project", 
      error: error.message 
    });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  getProjectTasks,
  updateProject,
  deleteProject
};