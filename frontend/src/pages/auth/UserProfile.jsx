import { useState, useEffect } from "react";
import { 
  Card, 
  Descriptions, 
  Button, 
  Form, 
  Input, 
  message,
  Tabs,
  Avatar,
  Space,
  List,
  Tag
} from "antd";
import { 
  UserOutlined, 
  MailOutlined, 
  TeamOutlined,
  HistoryOutlined,
  SettingOutlined
} from "@ant-design/icons";
import api from "../../api/axios"
import AvatarUpload from "../../components/avatarUpload";
import { useAuth } from "../../context/AuthContext";

const { TabPane } = Tabs;

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const { user: authUser, login } = useAuth();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      // Bu endpoint'i backend'e eklemeniz gerekecek
      const res = await api.get(`/users/profile`);
      setUser(res.data);
    } catch (error) {
      console.error("Fetch profile error:", error);
      message.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpdate = (newAvatarUrl) => {
    setUser(prev => ({ ...prev, avatarUrl: newAvatarUrl }));
    
    // Auth context'i güncelle
    const updatedAuthUser = { ...authUser, avatarUrl: newAvatarUrl };
    login({ token: localStorage.getItem('token'), user: updatedAuthUser });
  };

  const handleProfileUpdate = async (values) => {
    try {
      // Bu endpoint'i backend'e eklemeniz gerekecek
      const res = await api.put('/users/profile', values);
      setUser(res.data.user);
      message.success("Profile updated successfully");
    } catch (error) {
      console.error("Update profile error:", error);
      message.error("Failed to update profile");
    }
  };

  return (
    <div className="p-6">
      <Card 
        title={
          <div className="flex items-center">
            <SettingOutlined className="mr-2" />
            User Profile
          </div>
        }
        loading={loading}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Profile" key="profile">
            <div className="text-center mb-8">
              <AvatarUpload
                userId={user?.id}
                currentAvatar={user?.avatarUrl}
                onSuccess={handleAvatarUpdate}
                size={120}
              />
              <h2 className="text-2xl font-bold mt-4">{user?.fullName}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <Tag color={user?.role === 'admin' ? 'red' : 'blue'} className="mt-2">
                {user?.role?.toUpperCase()}
              </Tag>
            </div>
            
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Full Name">
                {user?.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {user?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Role">
                {user?.role}
              </Descriptions.Item>
              <Descriptions.Item label="Member Since">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
              </Descriptions.Item>
            </Descriptions>
          </TabPane>
          
          <TabPane tab="Edit Profile" key="edit">
            <Form
              layout="vertical"
              initialValues={{
                fullName: user?.fullName,
                email: user?.email
              }}
              onFinish={handleProfileUpdate}
            >
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter your full name' }]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>
              
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input prefix={<MailOutlined />} />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update Profile
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          
          <TabPane tab="Activity" key="activity">
            <Card title="Recent Activity" size="small">
              <List
                dataSource={[]} // Burayı backend'den gelen aktivite verileri ile dolduracaksınız
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar size="small" icon={<HistoryOutlined />} />}
                      title={item.title}
                      description={item.description}
                    />
                    <span className="text-gray-500 text-sm">{item.time}</span>
                  </List.Item>
                )}
                locale={{ emptyText: 'No recent activity' }}
              />
            </Card>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default UserProfile;