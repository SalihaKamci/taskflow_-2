import api from "./axios";

export const getEmployees = async () => {
  const res = await api.get("/users/employees");
  return res.data;
};

export const createEmployee = async (data) => {
  const res = await api.post("/users", data);
  return res.data;
};
