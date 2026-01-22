import { Routes, Route } from "react-router-dom";
import Tasks from "../pages/admin/tasks";
import TaskDetail from "../pages/admin/tasks/TaskDetail";
import TaskForm from "../pages/admin/tasks/TaskForm";

const AdminTaskRoutes = () => {
  return (
    <Routes>
      <Route index element={<Tasks />} />
      <Route path="new" element={<TaskForm />} />
      <Route path=":id" element={<TaskDetail />} />
      <Route path=":id/edit" element={<TaskForm />} />
    </Routes>
  );
};

export default AdminTaskRoutes;
