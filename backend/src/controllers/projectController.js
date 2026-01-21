const { Project ,Task } = require("../models");
const {PROJECT_STATUS} =require("../constants");

const createProject = async (req, res) => {
  try {
    const { name, description,status = PROJECT_STATUS.ACTIVE } = req.body;

    const project = await Project.create({
      name,
      description,
      status: PROJECT_STATUS.includes(status) ? status : PROJECT_STATUS.ACTIVE,
      createdBy: req.user.id
    });

    res.status(201).json({  message: "Project created successfully",project});
  } catch (error) {
    res.status(500).json({ message: "Project creation error", error });
  }
};
const getAllProjects = async (req, res) => {
  try {
    const where = req.user.role === "admin" 
      ? {} 
      : { createdBy: req.user.id };

    const projects = await Project.findAll({
      where,
      order: [["createdAt", "DESC"]]
    });
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Projects not loaded", error });
  }
};
const getProjectById = async (req, res) => {
  try {
    const where = req.user.role === "admin" 
      ? { id: req.params.id } 
      : { id: req.params.id, createdBy: req.user.id };

    const project = await Project.findOne({ where });
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Error loading project", error });
  }
};
const getProjectTasks = async (req, res) => {
  try {
  
    const projectWhere = req.user.role === "admin" 
      ? { id: req.params.id } 
      : { id: req.params.id, createdBy: req.user.id };

    const project = await Project.findOne({ where: projectWhere });
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const tasks = await Task.findAll({
      where: { projectId: req.params.id },
      order: [["createdAt", "DESC"]]
    });
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error loading tasks", error });
  }
};
const updateProject = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const project = await Project.findByPk(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.update(req.body);
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Error updating project", error });
  }
};
const deleteProject = async (req, res) => {
  try {
     if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    
    const result = await Project.destroy({ 
      where: { id: req.params.id } 
    });
    
    if (result === 0) {
      return res.status(404).json({ message: "Project not found or not authorized" });
    }
    
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error });
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