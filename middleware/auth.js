const jwt = require("jsonwebtoken");
const Owner = require("../models/Owner");

// ============================================
//  Verify JWT Token with Version Check
// ============================================
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  CHECK TOKEN VERSION for Owner
    if (decoded.isOwner) {
      const owner = await Owner.findById(decoded.id);

      if (!owner) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      if (decoded.tokenVersion !== owner.tokenVersion) {
        return res.status(401).json({
          message: "Session expired. Please login again.",
          sessionExpired: true,
        });
      }
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Token is invalid or expired",
      tokenInvalid: true,
    });
  }
};

// ============================================
//  Check if user is Owner
// ============================================
const isOwner = (req, res, next) => {
  if (!req.user || !req.user.isOwner) {
    return res.status(403).json({
      message: "Access denied. Owner only.",
    });
  }
  next();
};

// ============================================
//  Check if user has specific role
// ============================================
const hasRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (req.user.isOwner) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${allowedRoles.join(" or ")}`,
      });
    }

    next();
  };
};

module.exports = { verifyToken, isOwner, hasRole };
