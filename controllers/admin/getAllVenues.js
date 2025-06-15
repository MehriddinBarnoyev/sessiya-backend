const pool = require("../../config/db");

const getAllVenues = async (req, res) => {
  try {
    const response = await pool.query(`SELECT 
  v.*,
  o.firstname || ' ' || o.lastname AS owner_name,
  COALESCE(json_agg(DISTINCT p.PhotoURL) FILTER (WHERE p.PhotoURL IS NOT NULL), '[]') AS photos
FROM venue v
JOIN venueowner o ON v.ownerid = o.ownerid
LEFT JOIN photo p ON v.venueid = p.venueid
GROUP BY v.venueid, o.firstname, o.lastname;

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
