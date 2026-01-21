import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Table } from "antd";

import { getProjectById} from "../../../api/project";
const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    getProjectById(id).then(res => setProject(res.data));
  }, [id]);

  if (!project) return null;

  return (
    <>
      <Card title={project.name}>
        <p>{project.description}</p>
        <p>Durum: {project.status}</p>
      </Card>

      <Table
        dataSource={project.tasks}
        rowKey="id"
        columns={[
          { title: "Görev", dataIndex: "title" },
          { title: "Durum", dataIndex: "status" },
          { title: "Öncelik", dataIndex: "priority" },
        ]}
        style={{ marginTop: 16 }}
      />
    </>
  );
};

export default ProjectDetail;
