const pool = require("../../config/db");

const getBookedDatesByVenue = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT bookingdate FROM booking 
       WHERE venueid = $1 AND status = 'Upcoming'`,
      [id]
    );

    const bookedDates = result.rows.map(row => row.bookingdate);

    res.status(200).json(bookedDates);
  } catch (error) {
    console.error("Error fetching booked dates:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = getBookedDatesByVenue;
