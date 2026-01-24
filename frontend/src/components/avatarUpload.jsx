import { useState } from "react";
import { Avatar, Upload, Modal, message } from "antd";
import { UserOutlined, CameraOutlined } from "@ant-design/icons";
import { uploadAvatar } from "../api/file";


const AvatarUpload = ({ currentAvatar, onSuccess, size = 64 }) => {
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);


  const handleUpload = async (options) => {
    const { file } = options;
    setLoading(true);
    
    try {
      const result = await uploadAvatar(file);
      
      // Kullanıcı bilgilerini güncelle
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = {
        ...currentUser,
        avatarUrl: result.avatarUrl
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      if (onSuccess) onSuccess(result.avatarUrl);
      message.success("Avatar updated successfully");
    } catch (error) {
      console.error("Avatar upload error:", error);
      message.error("Failed to upload avatar");
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Image must be smaller than 5MB!');
        return false;
      }
      
      return true;
    },
    customRequest: handleUpload,
    showUploadList: false,
    accept: "image/*"
  };

  return (
    <div className="relative inline-block">
      <Avatar
        size={size}
        src={currentAvatar}
        icon={<UserOutlined />}
        className="cursor-pointer border-2 border-white shadow-lg"
        onClick={() => setPreviewVisible(true)}
      />
      
      <Upload {...uploadProps} className="absolute bottom-0 right-0">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer border-2 border-white shadow-lg hover:bg-blue-600">
          <CameraOutlined className="text-white" />
        </div>
      </Upload>
      
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
      
      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img
          alt="Avatar preview"
          style={{ width: '100%' }}
          src={currentAvatar || <UserOutlined />}
        />
      </Modal>
    </div>
  );
};

export default AvatarUpload;