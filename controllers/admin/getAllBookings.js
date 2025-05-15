const pool = require("../../config/db");

const getAllBookings = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.bookingid,
        b.bookingdate,
        b.numberofguests,
        b.firstname || ' ' || b.lastname AS userfullname,
        b.phonenumber,
        b.status,
        v.venueid,
        v.name AS venuename,
        v.district,
        v.address
      FROM booking b
      JOIN venue v ON b.venueid = v.venueid
      ORDER BY b.bookingdate ASC
    `);

    res.json({ bookings: result.rows });
  } catch (err) {
    console.error("Error in getAllBookings:", err);
    res.status(500).json({ message: "Xatolik", error: err.message });
  }
};

module.exports = getAllBookings;
