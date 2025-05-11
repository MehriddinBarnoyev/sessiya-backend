// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { registerOwner, loginOwner, loginAdmin, } = require("../controllers/authController");

router.post("/owner/register", registerOwner);
router.post("/owner/login", loginOwner);
router.post("/admin/login", loginAdmin);

module.exports = router;
