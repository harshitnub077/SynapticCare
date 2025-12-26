const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.log(`[AuthMiddleware] Missing Authorization header for ${req.method} ${req.url}`);
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            console.log(`[AuthMiddleware] Malformed Authorization header: ${authHeader}`);
            return res.status(401).json({ message: "Malformed token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.error(`[AuthMiddleware] Token verification failed for ${req.method} ${req.url}:`, error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;
