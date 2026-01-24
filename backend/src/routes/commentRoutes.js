const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { 
  createComment, 
  getTaskComments, 
  updateComment, 
  deleteComment 
} = require("../controllers/commentController");

// Yorum oluştur
router.post("/task/:taskId", protect, createComment);

// Görev yorumlarını getir
router.get("/task/:taskId", protect, getTaskComments);

// Yorum güncelle
router.put("/:commentId", protect, updateComment);

// Yorum sil
router.delete("/:commentId", protect, deleteComment);

module.exports = router;