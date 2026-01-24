import { useEffect, useState } from "react";
import { 
  Modal, 
  Descriptions, 
  Button, 
  Spin, 
  Tabs, 
  List, 
  Avatar, 
  Typography, 
  Space, 
  Upload, 
  message,
  Card,
  Tag,
  Input,
  Form,
  Popconfirm,
  Tooltip
} from "antd";
import { 
  UploadOutlined, 
  PaperClipOutlined,
  UserOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  SendOutlined
} from "@ant-design/icons";
import moment from "moment";
import api from "../../../api/axios";
import { 
  getTaskFiles, 

  deleteFile 
} from "../../../api/file";
import { 
  getTaskComments, 
  createComment, 
  updateComment, 
  deleteComment 
} from "../../../api/comment";
import { useAuth } from "../../../context/AuthContext";

const { Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const EnhancedTaskDetail = ({ taskId, visible, onClose }) => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [files, setFiles] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (visible && taskId) {
      fetchTaskDetails();
      fetchTaskFiles();
      fetchTaskComments();
    } else {
      setTask(null);
      setFiles([]);
      setComments([]);
    }
  }, [visible, taskId]);

  const fetchTaskDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/tasks/${taskId}`);
      setTask(res.data.task);
    } catch (error) {
      console.error("Task details error:", error);
      message.error("Failed to load task details");
    } finally {
      setLoading(false);
    }
  };

  const fetchTaskFiles = async () => {
    try {
      const data = await getTaskFiles(taskId);
      setFiles(data);
    } catch (error) {
      console.error("Fetch files error:", error);
    }
  };

  const fetchTaskComments = async () => {
    try {
      const data = await getTaskComments(taskId);
      setComments(data);
    } catch (error) {
      console.error("Fetch comments error:", error);
    }
  };

  const handleFileUpload = async (options) => {
    const { file } = options;
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('files', file);
      

      message.success(`${file.name} uploaded successfully`);
      fetchTaskFiles();
      
      // FileList'i temizle
      setFileList([]);
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await deleteFile(fileId);
      message.success("File deleted successfully");
      fetchTaskFiles();
    } catch (error) {
      console.error("Delete file error:", error);
      message.error("Failed to delete file");
    }
  };

  const handleSubmitComment = async () => {
    if (!commentContent.trim()) {
      message.warning("Please enter a comment");
      return;
    }

    try {
      await createComment(taskId, commentContent);
      message.success("Comment added");
      setCommentContent("");
      fetchTaskComments();
    } catch (error) {
      console.error("Submit comment error:", error);
      message.error("Failed to add comment");
    }
  };

  const handleUpdateComment = async (commentId, newContent) => {
    try {
      await updateComment(commentId, newContent);
      message.success("Comment updated");
      fetchTaskComments();
    } catch (error) {
      console.error("Update comment error:", error);
      message.error("Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      message.success("Comment deleted");
      fetchTaskComments();
    } catch (error) {
      console.error("Delete comment error:", error);
      message.error("Failed to delete comment");
    }
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('DD/MM/YYYY HH:mm');
  };

  const getFileIcon = (mimetype) => {
    if (mimetype.startsWith('image/')) return '🖼️';
    if (mimetype.includes('pdf')) return '📄';
    if (mimetype.includes('word')) return '📝';
    if (mimetype.includes('excel') || mimetype.includes('sheet')) return '📊';
    if (mimetype.includes('zip') || mimetype.includes('rar')) return '📦';
    return '📎';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('File must be smaller than 10MB!');
        return Upload.LIST_IMPROVE || false;
      }
      return true;
    },
    customRequest: handleFileUpload,
    fileList: fileList,
    onChange: ({ fileList: newFileList }) => setFileList(newFileList),
    showUploadList: false
  };

  return (
    <Modal
      title={
        <div className="flex items-center">
          <span>Task Details</span>
          {task && (
            <Tag color={task.status === 'Completed' ? 'green' : 'blue'} className="ml-2">
              {task.status}
            </Tag>
          )}
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      className="task-detail-modal"
    >
      {loading ? (
        <div className="text-center py-8">
          <Spin size="large" />
          <p className="mt-4">Loading task details...</p>
        </div>
      ) : task ? (
        <div className="task-detail-content">
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            className="mb-4"
          >
            <TabPane tab="Details" key="details">
              <Descriptions column={1} bordered className="mb-4">
                <Descriptions.Item label="Title">
                  <strong>{task.title}</strong>
                </Descriptions.Item>
                
                <Descriptions.Item label="Description">
                  {task.description || "-"}
                </Descriptions.Item>
                
                <Descriptions.Item label="Project">
                  {task.project?.name || "-"}
                </Descriptions.Item>
                
                <Descriptions.Item label="Assigned To">
                  {task.assignedUser ? (
                    <div className="flex items-center">
                      <Avatar 
                        src={task.assignedUser.avatarUrl} 
                        icon={<UserOutlined />} 
                        size="small"
                        className="mr-2"
                      />
                      <div>
                        <div>{task.assignedUser.fullName}</div>
                        <div className="text-gray-500 text-sm">{task.assignedUser.email}</div>
                      </div>
                    </div>
                  ) : "-"}
                </Descriptions.Item>
                
                <Descriptions.Item label="Due Date">
                  {formatDate(task.dueDate)}
                </Descriptions.Item>
                
                <Descriptions.Item label="Priority">
                  <Tag color={
                    task.priority === 'high' ? 'red' : 
                    task.priority === 'medium' ? 'orange' : 'green'
                  }>
                    {task.priority?.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </TabPane>
            
            <TabPane tab={`Files (${files.length})`} key="files">
              <Card 
                title="Task Files" 
                extra={
                  <Upload {...uploadProps}>
                    <Button 
                      icon={<UploadOutlined />} 
                      loading={uploading}
                    >
                      Upload File
                    </Button>
                  </Upload>
                }
              >
                {files.length > 0 ? (
                  <List
                    dataSource={files}
                    renderItem={file => (
                      <List.Item
                        actions={[
                          <Tooltip title="View" key="view">
                            <Button 
                              type="text" 
                              icon={<EyeOutlined />} 
                              onClick={() => window.open(file.url, '_blank')}
                            />
                          </Tooltip>,
                          <Tooltip title="Download" key="download">
                            <Button 
                              type="text" 
                              icon={<DownloadOutlined />}
                              href={file.url}
                              download={file.originalname}
                            />
                          </Tooltip>,
                          (user.id === file.uploadedBy || user.role === 'admin') && (
                            <Popconfirm
                              title="Delete this file?"
                              onConfirm={() => handleDeleteFile(file.id)}
                              okText="Yes"
                              cancelText="No"
                              key="delete"
                            >
                              <Tooltip title="Delete">
                                <Button 
                                  type="text" 
                                  danger 
                                  icon={<DeleteOutlined />}
                                />
                              </Tooltip>
                            </Popconfirm>
                          )
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <div className="text-2xl">
                              {getFileIcon(file.mimetype)}
                            </div>
                          }
                          title={
                            <div>
                              <div className="font-medium">{file.originalname}</div>
                              <div className="text-gray-500 text-sm">
                                Uploaded by {file.uploader?.fullName} • {formatDate(file.createdAt)}
                              </div>
                            </div>
                          }
                          description={
                            <Space>
                              <Tag>{file.mimetype}</Tag>
                              <Tag>{formatFileSize(file.size)}</Tag>
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <div className="text-center py-8">
                    <PaperClipOutlined className="text-4xl text-gray-300 mb-4" />
                    <p className="text-gray-500">No files uploaded yet</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Upload files related to this task
                    </p>
                  </div>
                )}
              </Card>
            </TabPane>
            
            <TabPane tab={`Comments (${comments.length})`} key="comments">
              <Card title="Comments">
                <div className="mb-6">
                  <div className="flex space-x-2">
                    <Avatar 
                      src={user.avatarUrl} 
                      icon={<UserOutlined />} 
                      size="large"
                    />
                    <div className="flex-1">
                      <TextArea
                        rows={3}
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Add a comment..."
                        className="mb-2"
                      />
                      <div className="flex justify-end">
                        <Button 
                          type="primary" 
                          icon={<SendOutlined />}
                          onClick={handleSubmitComment}
                          disabled={!commentContent.trim()}
                        >
                          Add Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="comments-list">
                  {comments.length > 0 ? (
                    comments.map(comment => (
                      <div key={comment.id} className="mb-6 pb-6 border-b last:border-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <Avatar 
                              src={comment.author?.avatarUrl} 
                              icon={<UserOutlined />} 
                              size="small"
                              className="mr-2"
                            />
                            <div>
                              <div className="font-medium">
                                {comment.author?.fullName}
                              </div>
                              <div className="text-gray-500 text-xs">
                                {formatDate(comment.createdAt)}
                                {comment.updatedAt !== comment.createdAt && " • Edited"}
                              </div>
                            </div>
                          </div>
                          
                          {(user.id === comment.userId || user.role === 'admin') && (
                            <Space>
                              <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => {
                                  const newContent = prompt("Edit comment:", comment.content);
                                  if (newContent && newContent !== comment.content) {
                                    handleUpdateComment(comment.id, newContent);
                                  }
                                }}
                              />
                              <Popconfirm
                                title="Delete this comment?"
                                onConfirm={() => handleDeleteComment(comment.id)}
                              >
                                <Button
                                  type="text"
                                  danger
                                  size="small"
                                  icon={<DeleteOutlined />}
                                />
                              </Popconfirm>
                            </Space>
                          )}
                        </div>
                        
                        <div className="ml-8">
                          <div className="text-gray-800 whitespace-pre-wrap">
                            {comment.content}
                          </div>
                          
                          {comment.attachments && comment.attachments.length > 0 && (
                            <div className="mt-3">
                              <div className="text-sm text-gray-500 mb-2">Attachments:</div>
                              <Space wrap>
                                {comment.attachments.map(attachment => (
                                  <Tooltip title={attachment.originalname} key={attachment.id}>
                                    <Button
                                      size="small"
                                      icon={<PaperClipOutlined />}
                                      onClick={() => window.open(attachment.url, '_blank')}
                                    >
                                      {attachment.originalname.substring(0, 15)}...
                                    </Button>
                                  </Tooltip>
                                ))}
                              </Space>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No comments yet</p>
                      <p className="text-gray-400 text-sm mt-2">
                        Be the first to comment on this task
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </TabPane>
          </Tabs>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Task information could not be loaded
        </div>
      )}
    </Modal>
  );
};

export default EnhancedTaskDetail;