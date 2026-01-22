import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Projects from "../pages/admin/projects/index";
import Dashboard from "../pages/AdminDashboard";
import Login from "../pages/auth/Login";
import Employees from "../pages/admin/employess/index";
import ChangePassword from "../pages/auth/ChangePassword";
import AdminTaskRoutes from "./AdminTaskRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={<AdminLayout />}
      >
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
       <Route path="employees" element={<Employees />} />
       <Route path="tasks/*" element={<AdminTaskRoutes />} />
      </Route>
<Route path="/change-password" element={<ChangePassword />} />
      <Route path="*" element={<Navigate to="/admin" />} />
    </Routes>
  );
};

export default AppRoutes;
