const express = require("express");
const router = express.Router();


router.post("/login",login);
router.post("/change-password",protect,changePassword);
module.exports=router;