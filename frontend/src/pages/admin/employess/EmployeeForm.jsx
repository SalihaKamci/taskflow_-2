import { Modal, Form, Input, message } from "antd";
import { createEmployee } from "../../../api/employee";

const EmployeeForm = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      await createEmployee(values);
      message.success("Employee created. Temporary password sent by email.");
      form.resetFields();
      onClose();
      onSuccess();
    } catch {
      message.error("Employee could not be created");
    }
  };

  return (
    <Modal
      title="New Employee"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Create"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Invalid email" },
          ]}
        >
          <Input placeholder="employee@email.com" />
        </Form.Item>
        
        <Form.Item 
          label="Full Name" 
          name="fullName" 
          rules={[{ required: true, message: "Full name is required" }]}
        >
          <Input placeholder="John Doe" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmployeeForm;