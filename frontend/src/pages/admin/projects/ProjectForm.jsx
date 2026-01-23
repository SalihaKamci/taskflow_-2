import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import { createProject, updateProject } from "../../../api/project";

const ProjectForm = ({ open, onClose, onSuccess, project }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      form.setFieldsValue({
        name: project.name,
        description: project.description,
        status: project.status
      });
    } else {
      form.resetFields();
    }
  }, [project, form]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (project) {
        await updateProject(project.id, values);
        message.success("Project updated successfully");
      } else {
        await createProject(values);
        message.success("Project created successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Project form error:", error);
      message.error(project ? "Failed to update project" : "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title={project ? "Update Project" : "New Project"}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText={project ? "Update" : "Create"}
      cancelText="Cancel"
    >
      <Form 
        form={form} 
        onFinish={handleSubmit} 
        layout="vertical"
        initialValues={{
          status: "Active"
        }}
      >
        <Form.Item 
          name="name" 
          label="Project Name" 
          rules={[{ required: true, message: 'Please enter project name' }]}
        >
          <Input placeholder="Enter project name" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea 
            placeholder="Enter project description" 
            rows={4}
          />
        </Form.Item>

        <Form.Item name="status" label="Status">
          <Select
            options={[
              { value: "Active", label: "Active" },
              { value: "Completed", label: "Completed" },
              { value: "On Hold", label: "On Hold" },
            ]}
            placeholder="Select status"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProjectForm;