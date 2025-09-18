const jwt = require("jsonwebtoken");

function auth(requiredRole) {
  return (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { id, role }

      if (requiredRole && req.user.role !== requiredRole) {
        return res.status(403).json({ msg: "Forbidden: wrong role" });
      }

      next();
    } catch (err) {
      res.status(401).json({ msg: "Token invalid" });
    }
  };
}

module.exports = auth;
