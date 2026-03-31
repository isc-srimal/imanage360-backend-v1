
const roleCheck = (allowedRoles) => {
    return (req, res, next) => {
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).send('Access denied: insufficient permissions');
      }
      next();
    };
  };
  
  module.exports = { roleCheck };
  