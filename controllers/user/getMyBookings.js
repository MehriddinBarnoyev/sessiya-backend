// controllers/user/getMyBookings.js

const pool = require("../../config/db");

const getMyBookings = async (req, res) => {
    const { phoneNumber } = req.query;

    if (!phoneNumber) {
        return res.status(400).json({ message: "Telefon raqam kerak" });
    }

    try {
        const result = await pool.query(
            `
      SELECT 
        b.BookingID,
        v.Name AS VenueName,
        b.BookingDate,
        b.NumberOfGuests,
        b.Status
      FROM Booking b
      JOIN "User" u ON b.UserID = u.UserID
      JOIN Venue v ON b.VenueID = v.VenueID
      WHERE u.PhoneNumber = $1
      ORDER BY b.BookingDate ASC
    `,
            [phoneNumber]
        );

        res.json({ bookings: result.rows });
    } catch (err) {
        res.status(500).json({ message: "Xatolik", error: err.message });
    }
};

module.exports = getMyBookings;
