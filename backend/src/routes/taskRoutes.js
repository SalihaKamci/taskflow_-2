const express = require("express");
const router = express.Router();
router.post("/", protect, isAdmin, createTask);
router.get("/", protect, getAllTasks);
router.patch("/:id/status", protect, isEmployee, updateTaskStatus);