import { Menu, Avatar, Dropdown } from "antd";
import {
  DashboardOutlined,
  ProjectOutlined,
  TeamOutlined,
  CheckSquareOutlined,
  LogoutOutlined,
  UserOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const profileMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/admin/profile')
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/admin/settings')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: () => {
        logout();
        navigate('/login');
      }
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* User Profile Section */}
      <div className="p-4 border-b">
        <Dropdown 
          menu={{ items: profileMenuItems }} 
          placement="bottomRight"
          trigger={['click']}
        >
          <div className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
            <Avatar
              size={40}
              src={user?.avatarUrl}
              icon={<UserOutlined />}
              className="mr-3"
            />
            <div className="flex-1">
              <div className="font-medium truncate">{user?.fullName}</div>
              <div className="text-xs text-gray-500 truncate">{user?.email}</div>
            </div>
          </div>
        </Dropdown>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-auto">
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={[
            {
              key: "/admin",
              icon: <DashboardOutlined />,
              label: "Dashboard",
            },
            {
              key: "/admin/projects",
              icon: <ProjectOutlined />,
              label: "Projects",
            },
            {
              key: "/admin/tasks",
              icon: <CheckSquareOutlined />,
              label: "Tasks",
            },
            {
              key: "/admin/employees",
              icon: <TeamOutlined />,
              label: "Employees",
            },
          ]}
          className="border-none"
        />
      </div>
    </div>
  );
};

export default Sidebar;