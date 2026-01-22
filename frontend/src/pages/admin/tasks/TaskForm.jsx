import { Modal, Form, Input, Select, DatePicker, message } from "antd";
import { useEffect, useState } from "react"; // useState ekledik
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import api from "../../../api/axios";

const TaskForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
     
        const employeesRes = await api.get("/users/employees");
        setEmployees(employeesRes.data);
        
        const projectsRes = await api.get("/projects");
        setProjects(projectsRes.data);
        
        
        if (isEdit) {
          const taskRes = await api.get(`/tasks/${id}`);
          const taskData = taskRes.data.task || taskRes.data;
          
    
          if (taskData.dueDate) {
            taskData.dueDate = moment(taskData.dueDate);
          }
          
          form.setFieldsValue(taskData);
        }
      } catch (error) {
        console.error("Veri çekme hatası:", error);
        message.error("Veriler yüklenemedi");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEdit, form]);

  const handleSubmit = async (values) => {
    try {
   
      const formattedValues = {
        ...values,
        dueDate: values.dueDate ? values.dueDate.format("YYYY-MM-DD") : null,
       
        projectId: values.projectId || 1, 
      };
      
      if (isEdit) {
        await api.put(`/tasks/${id}`, formattedValues);
        message.success("Görev güncellendi");
      } else {
        await api.post("/tasks", formattedValues);
        message.success("Görev oluşturuldu");
      }
      navigate("/admin/tasks");
    } catch (error) {
      console.error("Görev kaydetme hatası:", error);
      message.error("Görev kaydedilemedi");
    }
  };

  return (
    <Modal
      open
      title={isEdit ? "Görev Düzenle" : "Yeni Görev"}
      onCancel={() => navigate("/admin/tasks")}
      onOk={() => form.submit()}
      okText={isEdit ? "Güncelle" : "Oluştur"}
      cancelText="İptal"
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item 
          name="title" 
          label="Görev Başlığı" 
          rules={[{ required: true, message: "Görev başlığı gereklidir" }]}
        >
          <Input placeholder="Görev başlığını giriniz" />
        </Form.Item>

        <Form.Item name="description" label="Açıklama">
          <Input.TextArea rows={3} placeholder="Görev açıklamasını giriniz" />
        </Form.Item>

        <Form.Item name="projectId" label="Proje" rules={[{ required: true }]}>
          <Select placeholder="Proje seçiniz" loading={loading}>
            {projects.map(project => (
              <Select.Option key={project.id} value={project.id}>
                {project.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="assignedUserId" label="Atanacak Kişi">
          <Select 
            placeholder="Çalışan seçiniz" 
            allowClear
            loading={loading}
          >
            {employees.map(employee => (
              <Select.Option key={employee.id} value={employee.id}>
                {employee.fullName} ({employee.email})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item 
          name="dueDate" 
          label="Bitiş Tarihi"
          rules={[{ required: true, message: "Bitiş tarihi gereklidir" }]}
        >
          <DatePicker 
            className="w-full" 
            format="DD/MM/YYYY"
            placeholder="Bitiş tarihini seçiniz"
          />
        </Form.Item>

        <Form.Item name="priority" label="Öncelik">
          <Select placeholder="Öncelik seviyesi" defaultValue="medium">
            <Select.Option value="low">Düşük</Select.Option>
            <Select.Option value="medium">Orta</Select.Option>
            <Select.Option value="high">Yüksek</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskForm;