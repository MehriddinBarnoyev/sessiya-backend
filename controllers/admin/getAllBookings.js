// controllers/admin/getAllBookings.js

const pool = require("../../config/db");

const getAllBookings = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.BookingID,
        v.Name AS VenueName,
        b.BookingDate,
        b.NumberOfGuests,
        u.FirstName || ' ' || u.LastName AS UserFullName,
        u.PhoneNumber,
        b.Status
      FROM Booking b
      JOIN Venue v ON b.VenueID = v.VenueID
      JOIN "User" u ON b.UserID = u.UserID
      ORDER BY b.BookingDate ASC
    `);

    res.json({ bookings: result.rows });
  } catch (err) {
    res.status(500).json({ message: "Xatolik", error: err.message });
  }
};

module.exports = getAllBookings;
