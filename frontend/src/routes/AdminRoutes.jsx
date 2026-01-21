import { Routes, Route } from "react-router-dom";
import Projects from "../pages/admin/projects";
import ProjectDetail from "../pages/admin/projects/ProjectDetail";
import ProjectForm from "../pages/admin/projects/ProjectForm";


const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="projects" element={<Projects />} />
      <Route path="projects/new" element={<ProjectForm />} />
      <Route path="projects/:id" element={<ProjectDetail />} />
      <Route path="projects/:id/edit" element={<ProjectForm />} />
    </Routes>
  );
};

export default AdminRoutes;
