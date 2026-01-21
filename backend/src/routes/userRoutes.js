const express = require("express");
const router = express.Router();
const {protect}=require("../middlewares/authMiddleware");
const {isAdmin}=require("../middlewares/roleMiddleware");
const {getEmployees, createEmployee}=require("../controllers/userController");
router.get("/", protect, isAdmin);      
router.post("/", protect, isAdmin, createEmployee);      
router.get("/employees", protect, isAdmin, getEmployees); 
// router.delete("/:id", protect, isAdmin, async (req, res) => {
//   // TODO: Kullanıcı silme controller'ını ekle
//   res.json({ message: "User delete endpoint - Implement later" });
// });
module.exports=router;