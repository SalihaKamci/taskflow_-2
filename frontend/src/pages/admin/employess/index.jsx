import { useEffect, useState } from "react";
import { Button, Table, message } from "antd";
import EmployeeForm from "./EmployeeForm";
import { getEmployees } from "../../../api/employee";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      setEmployees(data);
    } catch {
      message.error("Employees could not be loaded");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <span className="capitalize">{status}</span>
      ),
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Employees</h2>
        <Button type="primary" onClick={() => setOpen(true)}>
          New Employee
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={employees}
        loading={loading}
      />

      <EmployeeForm
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={fetchEmployees}
      />
    </div>
  );
};

export default Employees;
