import { useEffect, useState, useCallback } from "react";
import { Button, Table, Space, Popconfirm, message, Tag, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  FolderOutlined
} from "@ant-design/icons";

import { getProjects, deleteProject } from "../../../api/project";
import ProjectForm from "./ProjectForm";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      console.log("Fetched projects:", data);
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      message.error("Projects could not be loaded");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return 'blue';
      case 'completed': return 'green';
      case 'on hold': return 'orange';
      default: return 'default';
    }
  };

  const handleViewDetails = useCallback((id, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    console.log("Navigating to project:", id);
    
    setTimeout(() => {
      navigate(`/admin/projects/${id}`, { 
        replace: false,
        state: { fromProjects: true }
      });
    }, 1);
  }, [navigate]);

  const handleEdit = useCallback((project, e) => {
    if (e) e.stopPropagation();
    console.log("Editing project:", project.id);
    setSelectedProject(project);
    setOpen(true);
  }, []);

  const handleDelete = useCallback(async (id, e) => {
    if (e) e.stopPropagation();
    
    try {
      await deleteProject(id);
      message.success("Project deleted successfully");
      fetchProjects();
    } catch (error) {
      console.error("Delete error:", error);
      message.error("Failed to delete project");
    }
  }, [fetchProjects]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={(e) => handleViewDetails(record.id, e)}
        >
          <FolderOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          <span style={{ 
            fontWeight: 500,
            color: '#1890ff',
            textDecoration: 'underline'
          }}>
            {text}
          </span>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <Tooltip title={text || 'No description'}>
          <span style={{ 
            display: 'inline-block',
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {text || '-'}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Tasks",
      key: "tasks",
      render: (_, record) => (
        <div>
          <span style={{ fontSize: '12px', color: '#666' }}>
            {record.taskCount || 0} task(s)
          </span>
        </div>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small" onClick={(e) => e.stopPropagation()}>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={(e) => handleViewDetails(record.id, e)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={(e) => handleEdit(record, e)}
              style={{ color: '#52c41a' }}
            />
          </Tooltip>

          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure to delete this project?"
              description="This will also delete all tasks associated with this project."
              onConfirm={(e) => handleDelete(record.id, e)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                style={{ color: '#ff4d4f' }}
                onClick={(e) => e.stopPropagation()}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
         
        </div>
        <Button
          type="primary"
          icon={<FolderOutlined />}
          onClick={() => {
            setSelectedProject(null);
            setOpen(true);
          }}
          size="large"
        >
          New Project
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={projects}
        loading={loading}
        pagination={{
        
         
          showTotal: (total) => `Total ${total} projects`
        }}
        components={{
          body: {
            row: (props) => (
              <tr 
                {...props} 
                onClick={(e) => {
                  const id = props['data-row-key'];
                  if (id) {
                    handleViewDetails(id, e);
                  }
                }}
                style={{ 
                  cursor: 'pointer',
                  ...props.style 
                }}
              />
            )
          }
        }}
      />

      <ProjectForm
        open={open}
        project={selectedProject}
        onClose={() => {
          setOpen(false);
          setSelectedProject(null);
        }}
        onSuccess={() => {
          fetchProjects();
          setOpen(false);
          setSelectedProject(null);
        }}
      />
    </div>
  );
};

export default Projects;