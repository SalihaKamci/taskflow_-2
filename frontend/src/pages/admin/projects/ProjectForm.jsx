import { Modal, Form, Input, Select } from "antd";
import { createProject, updateProject } from "../../../api/project";

const ProjectForm = ({ open, onClose, onSuccess, project }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    if (project) {
      await updateProject(project.id, values);
    } else {
      await createProject(values);
    }
    onSuccess();
    onClose();
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      title={project ? "Proje Güncelle" : "Yeni Proje"}
      onCancel={onClose}
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={handleSubmit} initialValues={project}>
        <Form.Item name="name" label="Proje Adı" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Açıklama">
          <Input.TextArea />
        </Form.Item>

        <Form.Item name="status" label="Durum">
        <Select
  options={[
    { value: "Active", label: "Aktif" },
    { value: "Completed", label: "Tamamlandı" },
    { value: "On Hold", label: "Beklemede" },
  ]}
/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProjectForm;
