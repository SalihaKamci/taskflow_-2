import { useEffect, useState } from "react";
import { Button, Table, Space, Popconfirm, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    const res = await api.get("/tasks");
    setTasks(res.data);
  };

  const handleDelete = async (id) => {
    await api.delete(`/tasks/${id}`);
    message.success("Task deleted");
    fetchTasks();
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks();
  }, []);

  const columns = [
    { title: "Title", dataIndex: "title" },
    { title: "Project", dataIndex: ["project", "name"] },
    { title: "Assigned To", dataIndex: ["assignedUser", "email"] },
    { title: "Due Date", dataIndex: "dueDate" },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => navigate(`${record.id}`)}>
            Detail
          </Button>
          <Button onClick={() => navigate(`${record.id}/edit`)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete task?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold">Tasks</h1>
        <Button type="primary" onClick={() => navigate("new")}>
          New Task
        </Button>
      </div>

      <Table rowKey="id" columns={columns} dataSource={tasks} />
    </div>
  );
};

export default Tasks;
