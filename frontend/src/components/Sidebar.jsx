import { Menu } from "antd";
import {
  DashboardOutlined,
  ProjectOutlined,
  TeamOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      onClick={({ key }) => {
        if (key === "logout") {
          logout();
          navigate("/login");
        } else {
          navigate(key);
        }
      }}
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
          key: "/admin/employees",
          icon: <TeamOutlined />,
          label: "Employees",
        },
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: "Logout",
          danger: true,
        },
     
      ]}
    />
  );
};

export default Sidebar;
