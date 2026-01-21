import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const { Sider, Content } = Layout;

const AdminLayout = () => {
  return (
    <Layout className="min-h-screen">
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        className="!bg-white border-r"
      >
        <Sidebar />
      </Sider>

      <Layout>
        <Content className="p-4 md:p-6 bg-gray-100">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
