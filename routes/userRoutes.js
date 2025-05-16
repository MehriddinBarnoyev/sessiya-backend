const express = require("express");
const router = express.Router();

const createBooking = require("../controllers/user/createBooking");
const getMyBookings = require("../controllers/user/getMyBookings");
const cancelMyBooking = require("../controllers/user/cancelMyBooking");
const getConfirmedVenues = require("../controllers/user/getConfirmedVenues");
const getVenueById = require("../controllers/admin/getVenueById");


router.post("/bookings/:venueId", createBooking);
router.get("/bookings", getMyBookings);
router.get("/venues/:id", getVenueById);
router.delete("/bookings/:id", cancelMyBooking);
router.get("/confirmed-venues", getConfirmedVenues);

module.exports = router;
