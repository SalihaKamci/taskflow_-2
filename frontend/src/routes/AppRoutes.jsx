import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Projects from "../pages/admin/projects/index";
import Dashboard from "../pages/AdminDashboard";
import Login from "../pages/Login";

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
      </Route>

      <Route path="*" element={<Navigate to="/admin" />} />
    </Routes>
  );
};

export default AppRoutes;
