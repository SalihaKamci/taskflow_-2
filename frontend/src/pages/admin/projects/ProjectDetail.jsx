import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Descriptions, 
  Statistic,
  Row,
  Col,
  message,
  Popconfirm,
  Tabs,
  Alert,
  Badge,
  Progress,
  Avatar
} from "antd";
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  DeleteOutlined,
  FolderOutlined,
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  PlusOutlined
} from "@ant-design/icons";

import { getProjectById, deleteProject, getProjectTasks } from "../../../api/project";

const { TabPane } = Tabs;

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchProjectData = useCallback(async () => {
    if (!isMounted.current) return;

    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching project with ID:", id);
      
      const [projectData, tasksData] = await Promise.all([
        getProjectById(id),
        getProjectTasks(id)
      ]);
      
      if (!isMounted.current) return;
      
      console.log("Project data received:", projectData);
      console.log("Tasks data received:", tasksData);
      
      setProject(projectData);
      setTasks(tasksData || []);
    } catch (error) {
      console.error("Error in fetchProjectData:", error);
      
      if (!isMounted.current) return;
      
      setError(error.message || "Failed to load project data");
      message.error("Project data could not be loaded");
      
      setTimeout(() => {
        navigate("/admin/projects", { replace: true });
      }, 2000);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [id, navigate]);

  useEffect(() => {
    console.log("ProjectDetail useEffect triggered for ID:", id);
    fetchProjectData();
    
    return () => {
      console.log("ProjectDetail cleanup");
    };
  }, [fetchProjectData, id]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteProject(id);
      message.success("Project deleted successfully");
      navigate("/admin/projects");
    } catch (error) {
      console.error("Delete error:", error);
      message.error("Failed to delete project");
    }
  }, [id, navigate]);

  // Status renkleri ve ikonları
  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase() || '';
    
    if (statusLower.includes('active') || statusLower.includes('aktif')) {
      return {
        color: 'blue',
        icon: <PlayCircleOutlined />,
        text: 'Active',
        badgeColor: 'processing'
      };
    } else if (statusLower.includes('completed') || statusLower.includes('tamamlandı')) {
      return {
        color: 'green',
        icon: <CheckCircleOutlined />,
        text: 'Completed',
        badgeColor: 'success'
      };
    } else if (statusLower.includes('hold') || statusLower.includes('beklemede')) {
      return {
        color: 'orange',
        icon: <PauseCircleOutlined />,
        text: 'On Hold',
        badgeColor: 'warning'
      };
    } else {
      return {
        color: 'default',
        icon: <ClockCircleOutlined />,
        text: status || 'Unknown',
        badgeColor: 'default'
      };
    }
  };


  const getTaskStatusConfig = (status) => {
    const statusLower = status?.toLowerCase() || '';
    
    if (statusLower.includes('completed') || statusLower.includes('tamamlandı')) {
      return {
        color: 'green',
        icon: <CheckCircleOutlined />,
        text: 'Completed',
        badgeColor: 'success'
      };
    } else if (statusLower.includes('progress') || statusLower.includes('devam')) {
      return {
        color: 'blue',
        icon: <PlayCircleOutlined />,
        text: 'In Progress',
        badgeColor: 'processing'
      };
    } else if (statusLower.includes('todo') || statusLower.includes('yapılacak')) {
      return {
        color: 'default',
        icon: <ClockCircleOutlined />,
        text: 'To Do',
        badgeColor: 'default'
      };
    } else if (statusLower.includes('hold') || statusLower.includes('beklemede')) {
      return {
        color: 'orange',
        icon: <PauseCircleOutlined />,
        text: 'On Hold',
        badgeColor: 'warning'
      };
    } else {
      return {
        color: 'default',
        icon: <ClockCircleOutlined />,
        text: status || 'Unknown',
        badgeColor: 'default'
      };
    }
  };


  const getPriorityConfig = (priority) => {
    const priorityLower = priority?.toLowerCase() || '';
    
    if (priorityLower.includes('high') || priorityLower.includes('yüksek')) {
      return {
        color: 'red',
        text: 'High',
        level: 3
      };
    } else if (priorityLower.includes('medium') || priorityLower.includes('orta')) {
      return {
        color: 'orange',
        text: 'Medium',
        level: 2
      };
    } else if (priorityLower.includes('low') || priorityLower.includes('düşük')) {
      return {
        color: 'green',
        text: 'Low',
        level: 1
      };
    } else {
      return {
        color: 'default',
        text: priority || 'Medium',
        level: 2
      };
    }
  };


  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return {
      full: date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      short: date.toLocaleDateString('tr-TR'),
      weekday: date.toLocaleDateString('tr-TR', { weekday: 'long' }),
      time: date.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Proje detayları yükleniyor...</p>
          <p className="text-sm text-gray-500 mt-2">Proje ID: {id}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Alert
          message="Proje Yüklenemedi"
          description={
            <div>
              <p>{error}</p>
              <p className="mt-2">Proje ID: {id}</p>
              <p className="text-sm mt-2">
                2 saniye içinde proje listesine yönlendirileceksiniz...
              </p>
            </div>
          }
          type="error"
          showIcon
          icon={<ExclamationCircleOutlined />}
          className="mb-6"
        />
        <div className="flex gap-4">
          <Button 
            type="primary" 
            onClick={() => navigate("/admin/projects")}
            icon={<ArrowLeftOutlined />}
          >
            Projelere Dön
          </Button>
          <Button 
            onClick={() => window.location.reload()}
          >
            Sayfayı Yenile
          </Button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Alert
          message="Proje Bulunamadı"
          description={`"${id}" ID'li proje bulunamadı veya bu projeye erişim izniniz yok.`}
          type="warning"
          showIcon
          className="mb-6"
        />
        <Button 
          type="primary" 
          onClick={() => navigate("/admin/projects")}
        >
          Projelere Dön
        </Button>
      </div>
    );
  }


  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => {
      const status = t.status?.toLowerCase() || '';
      return status.includes('completed') || status.includes('tamamlandı');
    }).length,
    inProgress: tasks.filter(t => {
      const status = t.status?.toLowerCase() || '';
      return status.includes('progress') || status.includes('devam');
    }).length,
    todo: tasks.filter(t => {
      const status = t.status?.toLowerCase() || '';
      return status.includes('todo') || status.includes('yapılacak');
    }).length,
    overdue: tasks.filter(t => {
      if (!t.dueDate) return false;
      const status = t.status?.toLowerCase() || '';
      if (status.includes('completed') || status.includes('tamamlandı')) return false;
      return new Date(t.dueDate) < new Date();
    }).length
  };


  const completionRate = taskStats.total > 0 
    ? Math.round((taskStats.completed / taskStats.total) * 100)
    : 0;


  const taskColumns = [
    {
      title: "Görev",
      dataIndex: "title",
      key: "title",
      width: 250,
      render: (text, record) => (
        <div className="flex items-start">
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">{text}</div>
            {record.description && (
              <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                {record.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const config = getTaskStatusConfig(status);
        return (
          <Badge
            status={config.badgeColor}
            text={
              <span className="flex items-center gap-1">
                {config.icon}
                <span>{config.text}</span>
              </span>
            }
          />
        );
      },
    },
    {
      title: "Öncelik",
      dataIndex: "priority",
      key: "priority",
      width: 100,
      render: (priority) => {
        const config = getPriorityConfig(priority);
        return (
          <Tag color={config.color} className="font-medium">
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "Son Tarih",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 120,
      render: (date) => {
        if (!date) return <span className="text-gray-400">Belirtilmemiş</span>;
        
        const formatted = formatDate(date);
        const isOverdue = new Date(date) < new Date();
        
        return (
          <div className={`${isOverdue ? 'text-red-600' : 'text-gray-700'}`}>
            <div className="font-medium">{formatted.short}</div>
            <div className="text-xs text-gray-500">{formatted.weekday}</div>
            {isOverdue && (
              <div className="text-xs font-medium text-red-500 mt-1">
                ⚠ Geçmiş
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Atanan",
      dataIndex: "assignedUser",
      key: "assignedUser",
      width: 150,
      render: (user) => {
        if (!user) {
          return <span className="text-gray-400">Atanmamış</span>;
        }
        
        return (
          <div className="flex items-center gap-2">
            <Avatar 
              size="small" 
              style={{ 
                backgroundColor: '#1890ff',
                fontSize: '12px'
              }}
            >
              {user.fullName?.charAt(0) || 'U'}
            </Avatar>
            <div className="truncate">
              <div className="text-sm font-medium">{user.fullName}</div>
              <div className="text-xs text-gray-500 truncate">{user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: "İşlemler",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small"
            onClick={() => navigate(`/admin/tasks/${record.id}`)}
            className="text-blue-600 hover:text-blue-800"
          >
            Görüntüle
          </Button>
        </Space>
      ),
    },
  ];

  const projectStatus = getStatusConfig(project.status);

  return (
    <div className="p-6">
 
      <div className="mb-6">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate("/admin/projects")}
          className="mb-4"
        >
          Projelere Dön
        </Button>
        
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <FolderOutlined className="text-3xl text-blue-500" />
              <h1 className="text-3xl font-bold text-gray-800">
                {project.name}
              </h1>
            </div>
            <p className="text-gray-600 text-lg">{project.description}</p>
          </div>
          
          <Space>
          
            <Popconfirm
              title="Projeyi Sil"
              description="Bu projeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
              onConfirm={handleDelete}
              okText="Evet, Sil"
              cancelText="İptal"
            >
              <Button 
                danger 
                icon={<DeleteOutlined />}
              >
                Projeyi Sil
              </Button>
            </Popconfirm>
          </Space>
        </div>
      </div>

     
      <div className="mb-6">
        <Badge
          status={projectStatus.badgeColor}
          text={
            <span className="text-lg font-medium flex items-center gap-2">
              {projectStatus.icon}
              {projectStatus.text}
            </span>
          }
          className="px-4 py-2 bg-gray-50 rounded-lg inline-block"
        />
      </div>


      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        className="mb-6"
        items={[
          {
            key: 'overview',
            label: 'Genel Bakış',
            children: (
              <div className="space-y-6">
  
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={6}>
                    <Card className="hover:shadow-md transition-shadow">
                      <Statistic
                        title="Toplam Görev"
                        value={taskStats.total}
                        prefix={<FileTextOutlined />}
                        valueStyle={{ color: '#3f8600' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card className="hover:shadow-md transition-shadow">
                      <Statistic
                        title="Tamamlanan"
                        value={taskStats.completed}
                        prefix={<CheckCircleOutlined className="text-green-500" />}
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card className="hover:shadow-md transition-shadow">
                      <Statistic
                        title="Devam Eden"
                        value={taskStats.inProgress}
                        prefix={<PlayCircleOutlined className="text-blue-500" />}
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card className="hover:shadow-md transition-shadow">
                      <Statistic
                        title="Geçmiş"
                        value={taskStats.overdue}
                        prefix={<ExclamationCircleOutlined className="text-red-500" />}
                        valueStyle={{ color: '#ff4d4f' }}
                      />
                    </Card>
                  </Col>
                </Row>


                <Card title="Tamamlama Durumu" className="shadow-sm">
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-medium">İlerleme</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {completionRate}%
                        </span>
                      </div>
                      <Progress 
                        percent={completionRate} 
                        strokeColor={{
                          '0%': '#108ee9',
                          '100%': '#87d068',
                        }}
                        strokeWidth={10}
                        showInfo={false}
                      />
                      <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <span>{taskStats.completed} tamamlandı</span>
                        <span>{taskStats.total - taskStats.completed} kalan</span>
                      </div>
                    </div>
            
                    <div>
                      <h4 className="font-medium mb-3">Durum Dağılımı</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
                          <div className="text-sm text-gray-600">Tamamlandı</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</div>
                          <div className="text-sm text-gray-600">Devam Eden</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-600">{taskStats.todo}</div>
                          <div className="text-sm text-gray-600">Yapılacak</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <div className="text-2xl font-bold text-red-600">{taskStats.overdue}</div>
                          <div className="text-sm text-gray-600">Geçmiş</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>


                <Card title="Proje Bilgileri" className="shadow-sm">
                  <Descriptions column={2} bordered size="middle">
                    <Descriptions.Item label="Proje Adı" span={2}>
                      <div className="font-medium text-lg">{project.name}</div>
                    </Descriptions.Item>
                    
                    <Descriptions.Item label="Durum">
                      <Badge
                        status={projectStatus.badgeColor}
                        text={
                          <span className="flex items-center gap-2">
                            {projectStatus.icon}
                            {projectStatus.text}
                          </span>
                        }
                      />
                    </Descriptions.Item>
                    
                    <Descriptions.Item label="Oluşturan">
                      <div className="flex items-center gap-2">
                        <UserOutlined className="text-gray-500" />
                        <span>Kullanıcı ID: {project.createdBy}</span>
                      </div>
                    </Descriptions.Item>
                    
                    <Descriptions.Item label="Açıklama" span={2}>
                      <div className="text-gray-700 whitespace-pre-wrap">
                        {project.description || 'Açıklama eklenmemiş'}
                      </div>
                    </Descriptions.Item>
                    
                    <Descriptions.Item label="Oluşturulma Tarihi">
                      <div className="flex items-center gap-2">
                        <CalendarOutlined className="text-gray-500" />
                        <span>{formatDate(project.createdAt).full}</span>
                      </div>
                    </Descriptions.Item>
                    
                    <Descriptions.Item label="Son Güncelleme">
                      <div className="flex items-center gap-2">
                        <CalendarOutlined className="text-gray-500" />
                        <span>{formatDate(project.updatedAt).full}</span>
                      </div>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </div>
            )
          },
          {
            key: 'tasks',
            label: `Görevler (${tasks.length})`,
            children: (
              <Card className="shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Proje Görevleri</h3>
                    <p className="text-gray-600">Bu projeye ait tüm görevler</p>
                  </div>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => navigate(`/admin/tasks/new?projectId=${id}`)}
                  >
                    Yeni Görev Ekle
                  </Button>
                </div>
                
                {tasks.length > 0 ? (
                  <Table
                    dataSource={tasks}
                    columns={taskColumns}
                    rowKey="id"
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) => 
                        `${range[0]}-${range[1]} / ${total} görev`,
                    }}
                    scroll={{ x: 1000 }}
                    className="shadow-xs"
                  />
                ) : (
                  <div className="text-center py-12">
                    <FileTextOutlined className="text-4xl text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      Henüz görev eklenmemiş
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Bu projeye görev ekleyerek başlayın
                    </p>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />}
                      onClick={() => navigate(`/admin/tasks/new?projectId=${id}`)}
                    >
                      İlk Görevi Ekle
                    </Button>
                  </div>
                )}
              </Card>
            )
          }
        ]}
      />

 
    
    </div>
  );
};

export default ProjectDetail;