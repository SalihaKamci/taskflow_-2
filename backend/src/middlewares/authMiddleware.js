const jwt = require("jsonwebtoken");
const {User} = require("../models")


const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "header required or Use: Bearer <token>" });
  }

  try {
    const token = authHeader.split(" ")[1];
      
    if (!token) {
      return res.status(401).json({ 
        error: 'Token not found' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
 const userModel = await user.findByPk(decoded.id,{
      attributes: { 
        exclude: ['password']
      }
    });

    if (!userModel) {
      return res.status(401).json({ message: "User not Found" });
    }

    if (userModel.forcePasswordChange) {
      return res.status(403).json({ 
        error: 'Password change required',
        code: 'FORCE_PASSWORD_CHANGE',
        userId: userModel.id
      });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth error:" });
  }
};
module.exports = { protect };