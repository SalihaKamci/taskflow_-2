const {User} = require("../models")
const { USER_ROLES } = require("../constants"); 

const getEmployees = async (req, res) => {
  try {
    const employees = await User.findAll({
      where: { role: USER_ROLES.EMPLOYEE },
      attributes: ["id", "fullName","email"],
      order: [["fullName", "ASC"]],
    });

    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Failed to get employees",error: error.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ message: "Full name and email are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

   

    const employee = await User.create({
      fullName,
      email,
      password:"123456",
      role: "employee",
      forcePasswordChange: true,
    });

    res.status(201).json({
    message: "add employee",
      employee: {
        id: employee.id,
        fullName: employee.fullName,
        email: employee.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Employee create error" });
  }
};
module.exports = {
  getEmployees,
  createEmployee,
};