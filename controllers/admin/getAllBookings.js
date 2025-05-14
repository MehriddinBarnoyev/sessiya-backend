// controllers/admin/getAllBookings.js

const pool = require("../../config/db");

const getAllBookings = async (req, res) => {
  try {
    const result = await pool.query(`
      select * from booking
    `);

    res.json({ bookings: result.rows });
  } catch (err) {
    res.status(500).json({ message: "Xatolik", error: err.message });
  }
};

module.exports = getAllBookings;
