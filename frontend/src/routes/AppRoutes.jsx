import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Projects from "../pages/admin/projects/index";
import ProjectDetail from "../pages/admin/projects/ProjectDetail";
import ProjectForm  from "../pages/admin/projects/ProjectForm";
import Dashboard from "../pages/AdminDashboard";
import Login from "../pages/auth/Login";
import Employees from "../pages/admin/employess/index";
import ChangePassword from "../pages/auth/ChangePassword";
import AdminTaskRoutes from "./AdminTaskRoutes";
import UserProfile from  "../pages/auth/UserProfile";



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
        <Route path="projects/:id" element={<ProjectDetail />} /> {/* Buraya ekleyin */}
        <Route path="projects/:id/edit" element={<ProjectForm />} /> {/* Buraya ekleyin */}
       <Route path="employees" element={<Employees />} />
       <Route path="tasks/*" element={<AdminTaskRoutes />} />
         <Route path="profile" element={<UserProfile />} />
      </Route>
<Route path="/change-password" element={<ChangePassword />} />
      <Route path="*" element={<Navigate to="/admin" />} />
    </Routes>
  );
};

export default AppRoutes;
