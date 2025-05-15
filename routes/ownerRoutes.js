const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { ownerOnly } = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/uploadMiddleware");


const addVenue = require("../controllers/owner/addVenue");
const updateMyVenue = require("../controllers/owner/updateMyVenue");
const getMyBookings = require('../controllers/owner/getMyBookings')
const cancelBooking = require('../controllers/owner/cancelBooking');

router.post("/create-venue", authMiddleware, ownerOnly, addVenue);
router.patch("/venues/:id", authMiddleware, ownerOnly, upload.array("photos", 10), updateMyVenue);
router.get("/bookings", authMiddleware, ownerOnly, getMyBookings);
router.delete("/bookings/:id", authMiddleware, ownerOnly, cancelBooking);

module.exports = router;
