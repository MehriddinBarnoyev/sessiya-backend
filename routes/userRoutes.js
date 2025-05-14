const express = require("express");
const router = express.Router();

const createBooking = require("../controllers/user/createBooking");
const getMyBookings = require("../controllers/user/getMyBookings");
const cancelMyBooking = require("../controllers/user/cancelMyBooking");
const getConfirmedVenues = require("../controllers/user/getConfirmedVenues");

router.post("/bookings/:venueId", createBooking);
router.get("/bookings", getMyBookings);
router.delete("/bookings/:id", cancelMyBooking);
router.get("/confirmed-venues", getConfirmedVenues);

module.exports = router;
