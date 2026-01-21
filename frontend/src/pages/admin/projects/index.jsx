import { useEffect, useState } from "react";
import { Button, Table, Space, Popconfirm, message } from "antd";

import { getProjects, deleteProject } from "../../../api/project";
import ProjectForm from "./ProjectForm";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);



  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      message.error("Projects could not be loaded");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setSelectedProject(record);
              setOpen(true);
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete project?"
            onConfirm={async () => {
              await deleteProject(record.id);
              message.success("Project deleted");
              fetchProjects();
            }}
          >
            <Button danger type="link">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Projects</h2>
        <Button
          type="primary"
          onClick={() => {
            setSelectedProject(null);
            setOpen(true);
          }}
        >
          New Project
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={projects}
        loading={loading}
      />

      <ProjectForm
        open={open}
        project={selectedProject}
        onClose={() => setOpen(false)}
        onSuccess={fetchProjects}
      />
    </div>
  );
};

export default Projects;
