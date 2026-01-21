import {
  ProjectOutlined,
  ProfileOutlined,
  TeamOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const { Sider } = Layout;

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const adminMenu = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/admin"),
    },
    {
      key: "/projects",
      icon: <ProjectOutlined />,
      label: "Projeler",
      onClick: () => navigate("/projects"),
    },
    {
      key: "/tasks",
      icon: <ProfileOutlined />,
      label: "Görevler",
      onClick: () => navigate("/tasks"),
    },
    {
      key: "/employees",
      icon: <TeamOutlined />,
      label: "Çalışanlar",
      onClick: () => navigate("/employees"),
    },
  ];

  const employeeMenu = [
    {
      key: "/tasks",
      icon: <ProfileOutlined />,
      label: "Görevlerim",
      onClick: () => navigate("/tasks"),
    },
    {
      key: "/projects",
      icon: <ProjectOutlined />,
      label: "Projeler",
      onClick: () => navigate("/projects"),
    },
  ];

  return (
    <Sider
      width={220}
      className="min-h-screen bg-white border-r"
      breakpoint="lg"
      collapsedWidth="0"
    >
      <div className="h-16 flex items-center justify-center font-bold text-lg border-b">
        TaskFlow
      </div>

      <Menu
        mode="inline"
        defaultSelectedKeys={["/admin"]}
        items={user?.role === "admin" ? adminMenu : employeeMenu}
      />

      <div className="absolute bottom-0 w-full border-t">
        <Menu
          mode="inline"
          items={[
            {
              key: "logout",
              icon: <LogoutOutlined />,
              label: "Çıkış Yap",
              onClick: handleLogout,
              danger: true,
            },
          ]}
        />
      </div>
    </Sider>
  );
};

export default Sidebar;
