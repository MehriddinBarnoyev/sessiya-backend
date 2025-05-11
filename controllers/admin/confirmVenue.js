// controllers/admin/confirmVenue.js

const pool = require("../../config/db");

const confirmVenue = async (req, res) => {
  const venueId = req.params.id;
  try {
    const result = await pool.query(
      `UPDATE Venue SET Status = 'Confirmed' WHERE VenueID = $1 RETURNING *`,
      [venueId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Venue topilmadi" });
    }

    res.json({ message: "To'yxona tasdiqlandi", venue: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
};

module.exports = confirmVenue;
