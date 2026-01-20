const express = require("express");
const router = express.Router();
router.get("/", protect, isAdmin, getAllUsers);      
router.post("/", protect, isAdmin, createUser);      
router.get("/employees", protect, isAdmin, getEmployees); 