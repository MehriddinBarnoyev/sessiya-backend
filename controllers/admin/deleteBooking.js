// controllers/admin/deleteBooking.js

const pool = require("../../config/db");

const deleteBooking = async (req, res) => {
  const bookingId = req.params.id;

  try {
    const result = await pool.query("DELETE FROM Booking WHERE BookingID = $1 RETURNING *", [bookingId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Bron topilmadi" });
    }

    res.json({ message: "Bron bekor qilindi", booking: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
};

module.exports = deleteBooking;
