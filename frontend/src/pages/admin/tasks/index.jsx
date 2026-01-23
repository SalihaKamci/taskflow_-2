import { useEffect, useState } from "react";
import { Button, Table, Space, Popconfirm, message, Collapse, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import TaskDetailModal from "./TaskDetail";

const { Panel } = Collapse;

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      message.error("Görevler yüklenemedi");
      console.error("Görev yükleme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (id) => {
    setSelectedTaskId(id);
    setIsDetailModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      message.success("Görev silindi");
      fetchTasks();
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      message.error("Görev silinemedi");
    }
  };

  const handleCloseModal = () => {
    setIsDetailModalVisible(false);
    setSelectedTaskId(null);
  };

  useEffect(() => {
    fetchTasks();
  }, []);


  const groupTasksByProject = () => {
    const grouped = {};
    
    tasks.forEach(task => {
      const projectId = task.projectId;
      const projectName = task.project?.name || "Proje Atanmamış";
      
      if (!grouped[projectId]) {
        grouped[projectId] = {
          projectId,
          projectName,
          tasks: []
        };
      }
      
      grouped[projectId].tasks.push(task);
    });
    
    return Object.values(grouped);
  };

  const groupedProjects = groupTasksByProject();


  const getStatusColor = (status) => {
    const colors = {
      "Todo": "blue",
      "In_progress": "orange",
      "Completed": "green",
      "On_hold": "gray",
      "Blocked": "red"
    };
    return colors[status] || "default";
  };

  const columns = [
    { 
      title: "Görev Başlığı", 
      dataIndex: "title",
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          {record.description && (
            <div className="text-gray-500 text-sm truncate max-w-xs">
              {record.description}
            </div>
          )}
        </div>
      ),
      width: 300
    },
    { 
      title: "Atanan Kişi", 
      render: (_, record) => (
        <div>
          {record.assignedUser ? (
            <>
              <div>{record.assignedUser.fullName || "-"}</div>
              <div className="text-gray-500 text-xs">
                {record.assignedUser.email}
              </div>
            </>
          ) : (
            <span className="text-gray-400">Atanmadı</span>
          )}
        </div>
      ),
      width: 180
    },
    { 
      title: "Bitiş Tarihi", 
      dataIndex: "dueDate",
      render: (date) => {
        if (!date) return "-";
        
        const dueDate = new Date(date);
        const today = new Date();
        const timeDiff = dueDate - today;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        
        let className = "";
        if (daysDiff < 0) {
          className = "text-red-600 font-semibold";
        } else if (daysDiff <= 3) {
          className = "text-orange-600 font-medium";
        }
        
        return (
          <div className={className}>
            {dueDate.toLocaleDateString('tr-TR')}
            {daysDiff < 0 && <div className="text-xs">(Geçti)</div>}
          </div>
        );
      },
      width: 120,
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
    },
    {
      title: "Durum",
      dataIndex: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)} className="font-medium">
          {status}
        </Tag>
      ),
      width: 120,
      filters: [
        { text: 'Todo', value: 'Todo' },
        { text: 'In_progress', value: 'In_progress' },
        { text: 'Completed', value: 'Completed' },
        { text: 'On_hold', value: 'On_hold' },
        { text: 'Blocked', value: 'Blocked' }
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "İşlemler",
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            onClick={() => handleViewDetail(record.id)}
          >
            Detay
          </Button>
          <Button 
            size="small" 
            onClick={() => navigate(`${record.id}/edit`)}
          >
            Düzenle
          </Button>
          <Popconfirm
            title="Bu görevi silmek istediğinizden emin misiniz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button size="small" danger>
              Sil
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 180,
      fixed: 'right'
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Görevler</h1>
          <p className="text-gray-600">
            {tasks.length} görev - {groupedProjects.length} proje
          </p>
        </div>
        <Button 
          type="primary" 
          onClick={() => navigate("new")}
          size="large"
        >
          + Yeni Görev
        </Button>
      </div>

  
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Görevler yükleniyor...</p>
          </div>
        ) : groupedProjects.length > 0 ? (
          <Collapse 
            defaultActiveKey={groupedProjects.map(p => p.projectId)}
            className="task-group-collapse"
          >
            {groupedProjects.map(projectGroup => (
              <Panel 
                key={projectGroup.projectId}
                header={
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-semibold text-lg">
                        {projectGroup.projectName}
                      </span>
                      <Tag className="ml-2" color="blue">
                        {projectGroup.tasks.length} görev
                      </Tag>
                    </div>
                    <div className="text-gray-500 text-sm">
                      Proje ID: {projectGroup.projectId}
                    </div>
                  </div>
                }
              >
                <Table
                  rowKey="id"
                  columns={columns}
                  dataSource={projectGroup.tasks}
                  pagination={projectGroup.tasks.length > 5 ? {
                    pageSize: 5,
                    showSizeChanger: false
                  } : false}
                  size="small"
                  scroll={{ x: 800 }}
                />
              </Panel>
            ))}
          </Collapse>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Henüz görev bulunmuyor
            </h3>
            <p className="text-gray-500 mb-6">
              Yeni görevler oluşturarak başlayın
            </p>
            <Button 
              type="primary" 
              onClick={() => navigate("new")}
            >
              İlk Görevi Oluştur
            </Button>
          </div>
        )}
      </div>

      <TaskDetailModal
        taskId={selectedTaskId}
        visible={isDetailModalVisible}
        onClose={handleCloseModal}
      />

 
      <style jsx>{`
        .task-group-collapse :global(.ant-collapse-header) {
          background-color: #f8fafc !important;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .task-group-collapse :global(.ant-collapse-item) {
          border-bottom: 1px solid #e2e8f0 !important;
        }
        
        .task-group-collapse :global(.ant-collapse-content) {
          background-color: white;
        }
      `}</style>
    </div>
  );
};

export default Tasks;