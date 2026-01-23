import { Modal, Descriptions, Button, Spin } from "antd";
import { useEffect, useState } from "react";
import api from "../../../api/axios";

const TaskDetailModal = ({ taskId, visible, onClose }) => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && taskId) {
      fetchTaskDetails();
    } else {
      setTask(null);
    }
  }, [visible, taskId]);

  const fetchTaskDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/tasks/${taskId}`);
      setTask(res.data.task);
    } catch (error) {
      console.error("Görev detayları yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      "Todo": "#1890ff",
      "In_progress": "#fa8c16",
      "Completed": "#52c41a",
      "On_hold": "#8c8c8c",
      "Blocked": "#f5222d"
    };
    return colors[status] || "black";
  };

  const getPriorityText = (priority) => {
    const texts = {
      "critical": "Kritik",
      "high": "Yüksek",
      "medium": "Orta",
      "low": "Düşük"
    };
    return texts[priority] || priority;
  };

  return (
    <Modal
      title="Görev Detayları"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Kapat
        </Button>
      ]}
      width={700}
    >
      {loading ? (
        <div className="text-center py-8">
          <Spin size="large" />
          <p className="mt-4">Görev detayları yükleniyor...</p>
        </div>
      ) : task ? (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Başlık">
            <strong>{task.title}</strong>
          </Descriptions.Item>
          
          <Descriptions.Item label="Açıklama">
            {task.description || "-"}
          </Descriptions.Item>
          
          <Descriptions.Item label="Proje">
            {task.project?.name ? (
              <span>
                {task.project.name} 
                <span className="text-gray-500 ml-2">
                  ({task.project.status})
                </span>
              </span>
            ) : "-"}
          </Descriptions.Item>
          
          <Descriptions.Item label="Atanan Kişi">
            {task.assignedUser ? (
              <div>
                <div>{task.assignedUser.fullName || "-"}</div>
                <div className="text-gray-500 text-sm">{task.assignedUser.email}</div>
              </div>
            ) : "-"}
          </Descriptions.Item>
          
          <Descriptions.Item label="Oluşturan">
            {task.creator ? (
              <div>
                <div>{task.creator.fullName || "-"}</div>
                <div className="text-gray-500 text-sm">{task.creator.email}</div>
              </div>
            ) : "-"}
          </Descriptions.Item>
          
          <Descriptions.Item label="Bitiş Tarihi">
            {formatDate(task.dueDate)}
          </Descriptions.Item>
          
          <Descriptions.Item label="Durum">
            <span style={{ color: getStatusColor(task.status) }}>
              {task.status}
            </span>
          </Descriptions.Item>
          
          <Descriptions.Item label="Öncelik">
            {getPriorityText(task.priority)}
          </Descriptions.Item>
          
          <Descriptions.Item label="Oluşturulma Tarihi">
            {formatDateTime(task.createdAt)}
          </Descriptions.Item>
          
          <Descriptions.Item label="Son Güncelleme">
            {formatDateTime(task.updatedAt)}
          </Descriptions.Item>
          
          {task.project?.description && (
            <Descriptions.Item label="Proje Açıklaması">
              {task.project.description}
            </Descriptions.Item>
          )}
        </Descriptions>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Görev bilgileri yüklenemedi
        </div>
      )}
    </Modal>
  );
};

export default TaskDetailModal;