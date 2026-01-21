const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const login = async (req, res) => {
    try {
        console.log("Login api");
        console.log("Request body:", req.body);
        const { email, password } = req.body;
        console.log("LOGIN PASSWORD RAW:", `"${password}"`);
        if (!email || !password) {
            return res.status(400).json({ message: "email  password required" });
        }
        console.log(`search: ${email}`);
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: "email invalid" });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            console.log(`password invalid`);
            return res.status(401).json({ message: "password invalid" });
        }

        console.log("login okay");

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                forcePasswordChange: user.forcePasswordChange,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                forcePasswordChange: user.forcePasswordChange,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Login error", error });
    }
};


const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "oldPassword and newPassword required" });
        }

        const user = await User.findByPk(userId);

        const isMatch = await bcryptjs.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: " old password" });
        }
        
        user.changed("password", true);
        user.password = newPassword;
        user.forcePasswordChange = false;
        await user.save();

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                forcePasswordChange: false,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Password successfully updated",
            token,
        });
    } catch (error) {
        res.status(500).json({
            message: "Password change error",
            error: error.message,
        });
    }
};
module.exports = { login, changePassword };