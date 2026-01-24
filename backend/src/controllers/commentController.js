const { Comment, User, File } = require("../models");

const createComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const comment = await Comment.create({
      content,
      taskId: parseInt(taskId),
      userId
    });

    const commentWithAuthor = await Comment.findByPk(comment.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'fullName', 'email', 'avatarUrl']
      }]
    });

    res.status(201).json({
      message: "Comment created successfully",
      comment: commentWithAuthor
    });
  } catch (error) {
    console.error("Create comment error:", error);
    res.status(500).json({ 
      message: "Failed to create comment", 
      error: error.message 
    });
  }
};

const getTaskComments = async (req, res) => {
  try {
    const { taskId } = req.params;

    const comments = await Comment.findAll({
      where: { taskId },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'fullName', 'email', 'avatarUrl']
        },
        {
          model: File,
          as: 'attachments',
          attributes: ['id', 'filename', 'originalname', 'mimetype', 'size', 'url', 'createdAt']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(comments);
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ 
      message: "Failed to get comments", 
      error: error.message 
    });
  }
};

const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Sadece yazar veya admin güncelleyebilir
    if (comment.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: "You can only update your own comments" 
      });
    }

    comment.content = content || comment.content;
    await comment.save();

    const updatedComment = await Comment.findByPk(commentId, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'fullName', 'email', 'avatarUrl']
      }]
    });

    res.json({
      message: "Comment updated successfully",
      comment: updatedComment
    });
  } catch (error) {
    console.error("Update comment error:", error);
    res.status(500).json({ 
      message: "Failed to update comment", 
      error: error.message 
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Sadece yazar veya admin silebilir
    if (comment.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: "You can only delete your own comments" 
      });
    }

    await comment.destroy();

    res.json({ 
      message: "Comment deleted successfully" 
    });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ 
      message: "Failed to delete comment", 
      error: error.message 
    });
  }
};

module.exports = {
  createComment,
  getTaskComments,
  updateComment,
  deleteComment
};