const express = require("express");
const router = express.Router();
const {protect}=require("../middlewares/authMiddleware");
const {isAdmin}=require("../middlewares/roleMiddleware");
const {createProject,getAllProjects, getProjectById, updateProject,getProjectTasks,deleteProject}=require("../controllers/projectController");

router.get("/", protect,getAllProjects);
router.get("/:id", protect, isAdmin, getProjectById);
router.get("/:id/tasks", protect, getProjectTasks);

router.post("/", protect, isAdmin, createProject);
router.put("/id", protect, isAdmin, updateProject);
router.delete("/:id", protect, isAdmin, deleteProject);

module.exports = router;