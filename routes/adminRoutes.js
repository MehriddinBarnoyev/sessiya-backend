const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/uploadMiddleware");


const createVenueOwner = require("../controllers/admin/createVenueOwner");
const addVenue = require("../controllers/admin/addVenue");
const confirmVenue = require("../controllers/admin/confirmVenue");
const updateVenue = require("../controllers/admin/updateVenue");
const deleteVenue = require("../controllers/admin/deleteVenue");
const getAllBookings = require("../controllers/admin/getAllBookings");
const deleteBooking = require("../controllers/admin/deleteBooking");
const createAdmin = require("../controllers/admin/createAdmin");
const getAllOwners = require("../controllers/admin/getAllOwners");
const getAllVenues = require("../controllers/admin/getAllVenues");
const getVenueById = require("../controllers/admin/getVenueById");



router.post("/create", authMiddleware, adminOnly, createAdmin);
router.post("/owners", authMiddleware, adminOnly, createVenueOwner);
router.get("/venuesAll", authMiddleware, adminOnly, getAllVenues);
router.get("/venues/:id",  getVenueById);
router.get("/ownersAll", authMiddleware, adminOnly, getAllOwners);
router.post("/venues", authMiddleware, adminOnly, addVenue);
router.patch("/venues/:id/confirm", authMiddleware, adminOnly, confirmVenue);
router.patch("/venues/:id", authMiddleware, adminOnly, upload.array("photos", 10), updateVenue);
router.delete("/venues/:id", authMiddleware, adminOnly, deleteVenue);
router.get("/bookings", authMiddleware, adminOnly, getAllBookings);
router.delete("/bookings/:id", authMiddleware, adminOnly, deleteBooking);

module.exports = router;
