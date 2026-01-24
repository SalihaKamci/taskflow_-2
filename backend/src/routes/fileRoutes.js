const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/roleMiddleware");
const { 
  uploadTaskFiles, 
  uploadAvatar, 
  getTaskFiles, 
  deleteFile 
} = require("../controllers/fileController");
const { 
  singleFileUpload, 
  multipleFileUpload 
} = require("../middlewares/upload");

// Avatar yükleme
router.post(
  "/avatar", 
  protect, 
  singleFileUpload('avatar'), 
  uploadAvatar
);

// Göreve dosya yükleme
router.post(
  "/task/:taskId", 
  protect, 
  multipleFileUpload('files', 10), 
  uploadTaskFiles
);

// Görev dosyalarını getir
router.get("/task/:taskId", protect, getTaskFiles);

// Dosya sil
router.delete("/:fileId", protect, deleteFile);

module.exports = router;