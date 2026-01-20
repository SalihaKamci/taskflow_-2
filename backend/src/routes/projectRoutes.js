const express = require("express");
const router = express.Router();

router.post("/", protect, isAdmin, createProject);
router.get("/", protect, isAdmin, getAllProjects);