const express = require("express");
const router = express.Router();
const {protect}=require("../middlewares/authMiddleware");
const {createTask ,getAllTasks, updateTaskStatus,getTaskById,updateTask,deleteTask}=require("../controllers/taskController");
const {isAdmin}=require("../middlewares/roleMiddleware");
router.post("/", protect, isAdmin, createTask);
router.get("/", protect, getAllTasks);
router.get("/:id", protect, getTaskById);
router.patch("/:id/status", protect, updateTaskStatus);
router.put("/:id", protect, isAdmin, updateTask);
// router.post("/", protect, multipleFileUpload('files', 10), createTask);
// router.put("/:id", protect, multipleFileUpload('files', 10),  updateTask);

router.delete("/:id", protect, isAdmin, deleteTask);
module.exports = router;