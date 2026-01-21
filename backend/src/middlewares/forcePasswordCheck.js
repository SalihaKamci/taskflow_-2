const forcePasswordChangeCheck = (req, res, next) => {
  if (req.user.forcePasswordChange) {
    return res.status(403).json({
      message: "temporary password : not accessed ",
    });
  }
  next();
};

module.exports = { forcePasswordChangeCheck };