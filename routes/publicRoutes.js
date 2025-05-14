// routes/publicRoutes.js

const express = require("express");
const router = express.Router();

const getConfirmedVenues = require("../controllers/public/getConfirmedVenues");
const getBookedDatesByVenue = require("../controllers/public/getBookedDatesByVenue");

router.get("/venues", getConfirmedVenues);
router.get("/venues/:id/booked-dates", getBookedDatesByVenue);

module.exports = router;
