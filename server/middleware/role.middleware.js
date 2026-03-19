export const requireRole = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: `Access denied. Required: ${roles.join(' or ')}` });
    }
    next();
  };
  
  export const requireInstructor = requireRole('instructor', 'admin');
  export const requireAdmin = requireRole('admin');