export const roleMiddleware = (requiredRole) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized. User not authenticated.' });
    }

    if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: `Access denied. Only ${requiredRole}s can access this route.` });
    }

    next();
};
