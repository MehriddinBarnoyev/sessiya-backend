const pool = require("../../config/db");

const getMyBookings = async (req, res) => {
  const ownerId = req.user.id;

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
      WHERE v.OwnerID = $1
      ORDER BY b.BookingDate ASC
    `, [ownerId]);

    res.json({ bookings: result.rows });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
};

module.exports = getMyBookings;
