// middlewares/roleMiddleware.js

const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Faqat admin ruxsat etiladi" });
    }
    next();
  };
  
  const ownerOnly = (req, res, next) => {
    if (!req.user || req.user.role !== "owner") {
      return res.status(403).json({ message: "Faqat to'yxona egasi kirishi mumkin" });
    }
    next();
  };
  
  module.exports = {
    adminOnly,
    ownerOnly,
  };
  