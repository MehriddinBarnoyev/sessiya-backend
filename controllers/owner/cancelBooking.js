const pool = require("../../config/db");

const cancelBooking = async (req, res) => {
  const bookingId = req.params.id;
  const ownerId = req.user.id;

  try {
    const result = await pool.query(`
      DELETE FROM Booking
      WHERE BookingID = $1 AND VenueID IN (
        SELECT VenueID FROM Venue WHERE OwnerID = $2
      )
      RETURNING *;
    `, [bookingId, ownerId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Bron sizga tegishli emas yoki mavjud emas" });
    }

    res.json({ message: "Bron bekor qilindi", booking: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
};

module.exports = cancelBooking;
