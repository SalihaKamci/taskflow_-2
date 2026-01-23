import { Routes, Route } from "react-router-dom";
import Projects from "../pages/admin/projects";
import ProjectDetail from "../pages/admin/projects/ProjectDetail";
import ProjectForm from "../pages/admin/projects/ProjectForm";

import Tasks from "../pages/admin/tasks";
import TaskDetail from "../pages/admin/tasks/TaskDetail";
import TaskForm from "../pages/admin/tasks/TaskForm";


const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="projects" element={<Projects />} />
      <Route path="projects/new" element={<ProjectForm />} />
     <Route path="projects/:id" element={<ProjectDetail />} />
      <Route path="projects/:id/edit" element={<ProjectForm />} />

        <Route index element={<Tasks />} />
      <Route path="new" element={<TaskForm />} />
      <Route path=":id" element={<TaskDetail />} />
      <Route path=":id/edit" element={<TaskForm />} />
      
    </Routes>
  );
};

export default AdminRoutes;
