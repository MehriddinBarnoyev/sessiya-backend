const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { ownerOnly } = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/uploadMiddleware");


const addVenue = require("../controllers/owner/addVenue");
const updateMyVenue = require("../controllers/owner/updateMyVenue");
const getMyBookings = require('../controllers/owner/getMyBookings')
const cancelBooking = require('../controllers/owner/cancelBooking');
const getOwnerVenues = require("../controllers/owner/getOwnerVenues");
const getVenueById = require("../controllers/admin/getVenueById");



router.get("/bookings", authMiddleware, ownerOnly, getMyBookings);
router.get("/venues/:id",  getVenueById);
router.post("/create-venue", authMiddleware, ownerOnly, upload.array('images', 10), addVenue);
router.post("/venues", authMiddleware, ownerOnly, getOwnerVenues);
router.patch("/venues/:id", authMiddleware, ownerOnly, upload.array("images", 10), updateMyVenue);
router.delete("/bookings/:id", authMiddleware, ownerOnly, cancelBooking);

module.exports = router;
