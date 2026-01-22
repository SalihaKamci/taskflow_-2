import { Modal, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const ChangePassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (values) => {
    try {
      const res = await api.post("/auth/change-password", {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });

      login(res.data);

      message.success("Password changed successfully");
      navigate("/admin");
    } catch {
      message.error("Password change failed");
    }
  };

  return (
    <Modal
      open
      closable={false}
      footer={null}
      title="Change Your Password"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="oldPassword"
          label="Temporary Password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            { required: true },
            { min: 6, message: "Minimum 6 characters" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={["newPassword"]}
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Passwords do not match");
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Update Password
        </button>
      </Form>
    </Modal>
  );
};

export default ChangePassword;
