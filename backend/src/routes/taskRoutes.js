const express = require("express");
const router = express.Router();
const {protect}=require("../middlewares/authMiddleware");
const {createTask ,getAllTasks, updateTaskStatus,getTaskById}=require("../controllers/taskController");
const {isAdmin}=require("../middlewares/roleMiddleware");
router.post("/", protect, isAdmin, createTask);
router.get("/", protect, getAllTasks);
router.get("/:id", protect, getTaskById);
router.patch("/:id/status", protect, updateTaskStatus);

// router.put("/:id", protect, isAdmin, updateTask);
// router.delete("/:id", protect, isAdmin, deleteTask);
module.exports = router;