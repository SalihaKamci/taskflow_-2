const express = require("express");
const router = express.Router();
const {protect}=require("../middlewares/authMiddleware");

router.get("/", protect, forcePasswordCheck, getDashboardStats);