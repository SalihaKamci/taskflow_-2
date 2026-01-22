import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values) => {
    try {
      const res = await api.post("/auth/login", values);

      login(res.data);

      const { user } = res.data;

      if (user.role === "employee" && user.forcePasswordChange) {
        navigate("/change-password");
      } else {
        navigate("/admin");
      }
    } catch {
      message.error("Invalid credentials");
    }
  };

  return (
    <Form onFinish={onFinish} layout="vertical" className="max-w-md mx-auto mt-32">
      <Form.Item name="email" label="Email" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="password" label="Password" rules={[{ required: true }]}>
        <Input.Password />
      </Form.Item>

      <Button type="primary" htmlType="submit" block>
        Login
      </Button>
    </Form>
  );
};

export default Login;
