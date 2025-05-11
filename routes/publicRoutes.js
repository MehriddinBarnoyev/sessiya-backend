// routes/publicRoutes.js

const express = require("express");
const router = express.Router();

const getConfirmedVenues = require("../controllers/public/getConfirmedVenues");

router.get("/venues", getConfirmedVenues);

module.exports = router;
