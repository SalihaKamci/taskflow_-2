const { File, Task, User, Comment } = require("../models");
const fs = require('fs');
const path = require('path');

const uploadTaskFiles = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const savedFiles = [];
    
    for (const file of req.files) {
      const fileRecord = await File.create({
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path,
        url: `${req.protocol}://${req.get('host')}/${file.path}`,
        entityType: 'task',
        entityId: parseInt(taskId),
        uploadedBy: userId
      });
      
      savedFiles.push(fileRecord);
    }

    res.status(201).json({
      message: "Files uploaded successfully",
      files: savedFiles,
      count: savedFiles.length
    });
  } catch (error) {
    console.error("File upload error:", error);
    
    // Hata durumunda yüklenen dosyaları temizle
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    
    res.status(500).json({ 
      message: "File upload failed", 
      error: error.message 
    });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Eski avatarı sil
    if (user.avatarUrl) {
      const oldAvatarPath = user.avatarUrl.replace(
        `${req.protocol}://${req.get('host')}/`, 
        ''
      );
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
      
      // Eski file kaydını sil
      await File.destroy({
        where: {
          entityType: 'user',
          entityId: userId
        }
      });
    }

    // Yeni file kaydı oluştur
    const fileRecord = await File.create({
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      url: `${req.protocol}://${req.get('host')}/${req.file.path}`,
      entityType: 'user',
      entityId: userId,
      uploadedBy: userId
    });

    // Kullanıcıyı güncelle
    user.avatarUrl = fileRecord.url;
    await user.save();

    res.json({
      message: "Avatar uploaded successfully",
      avatarUrl: fileRecord.url,
      file: fileRecord
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    
    // Hata durumunda dosyayı temizle
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      message: "Avatar upload failed", 
      error: error.message 
    });
  }
};

const getTaskFiles = async (req, res) => {
  try {
    const { taskId } = req.params;

    const files = await File.findAll({
      where: {
        entityType: 'task',
        entityId: taskId
      },
      include: [{
        model: User,
        as: 'uploader',
        attributes: ['id', 'fullName', 'email', 'avatarUrl']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(files);
  } catch (error) {
    console.error("Get task files error:", error);
    res.status(500).json({ 
      message: "Failed to get task files", 
      error: error.message 
    });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.user.id;

    const file = await File.findByPk(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Yetki kontrolü
    const isAdmin = req.user.role === 'admin';
    const isOwner = file.uploadedBy === userId;
    
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ 
        message: "You are not authorized to delete this file" 
      });
    }

    // Dosyayı fiziksel olarak sil
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Veritabanı kaydını sil
    await file.destroy();

    res.json({ 
      message: "File deleted successfully",
      deletedFile: file
    });
  } catch (error) {
    console.error("Delete file error:", error);
    res.status(500).json({ 
      message: "Failed to delete file", 
      error: error.message 
    });
  }
};

module.exports = {
  uploadTaskFiles,
  uploadAvatar,
  getTaskFiles,
  deleteFile
};