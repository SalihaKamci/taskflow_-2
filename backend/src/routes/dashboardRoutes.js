const express = require("express");
const router = express.Router();
const {protect  }=require("../middlewares/authMiddleware");
const {getDashboardStats}=require("../controllers/dashboardController");
const {forcePasswordChangeCheck}=require("../middlewares/forcePasswordCheck");

router.get("/", protect, forcePasswordChangeCheck, getDashboardStats);
module.exports=router;