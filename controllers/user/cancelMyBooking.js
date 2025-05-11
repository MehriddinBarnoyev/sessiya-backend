// controllers/user/cancelMyBooking.js

const pool = require("../../config/db");

const cancelMyBooking = async (req, res) => {
  const bookingId = req.params.id;
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Telefon raqam kerak" });
  }

  try {
    const result = await pool.query(
      `
      DELETE FROM Booking
      WHERE BookingID = $1 AND UserID = (
        SELECT UserID FROM "User" WHERE PhoneNumber = $2
      )
      RETURNING *;
    `,
      [bookingId, phoneNumber]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Bron topilmadi yoki sizga tegishli emas" });
    }

    res.json({ message: "Bron bekor qilindi", booking: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Xatolik", error: err.message });
  }
};

module.exports = cancelMyBooking;
