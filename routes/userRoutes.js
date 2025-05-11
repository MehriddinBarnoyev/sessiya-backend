const express = require("express");
const router = express.Router();

const createBooking = require("../controllers/user/createBooking");
const getMyBookings = require("../controllers/user/getMyBookings");
const cancelMyBooking = require("../controllers/user/cancelMyBooking");

router.post("/bookings", createBooking); // bron qilish (public)
router.get("/bookings", getMyBookings); // ?phoneNumber=
router.delete("/bookings/:id", cancelMyBooking); // body: { phoneNumber }

module.exports = router;
