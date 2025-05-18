const pool = require("../../config/db");

const getAllVenues = async (req, res) => {
  try {
    const response = await pool.query(`
      SELECT 
        v.*,
        o.firstname || ' ' || o.lastname AS owner_name
      FROM venue v
      JOIN venueowner o ON v.ownerid = o.ownerid
    `);

    res.status(200).json({
      venues: response.rows,
    });
  } catch (error) {
    console.error("Venue fetch error:", error);
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

module.exports = getAllVenues;
