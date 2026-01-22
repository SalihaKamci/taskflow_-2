import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Descriptions } from "antd";
import api from "../../../api/axios";

const TaskDetail = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    api.get(`/tasks/${id}`).then((res) => setTask(res.data));
  }, [id]);

  if (!task) return null;

  return (
    <Card title="Task Detail">
      <Descriptions column={1}>
        <Descriptions.Item label="Title">{task.title}</Descriptions.Item>
        <Descriptions.Item label="Description">
          {task.description}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          {task.status}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default TaskDetail;
