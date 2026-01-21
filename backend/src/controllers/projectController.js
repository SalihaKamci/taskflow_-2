const { Project } = require("../models");
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
    const projects = await Project.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Projects not loaded", error });
  }
};


module.exports = {
  createProject,
  getAllProjects,
};