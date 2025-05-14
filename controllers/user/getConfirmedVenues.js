// controllers/user/getConfirmedVenues.js
const pool = require("../../config/db");

const getConfirmedVenues = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        v.venueid,
        v.name,
        v.district,
        v.address,
        v.capacity,
        v.priceperseat,
        v.phonenumber,
        v.description,
        v.status,
        v.createdat,
        v.updatedat,
        ARRAY_AGG(p.photourl) AS photos
      FROM venue v
      LEFT JOIN photo p ON v.venueid = p.venueid
      WHERE v.status = 'Confirmed'
      GROUP BY v.venueid
      ORDER BY v.createdat DESC;
    `);

    res.status(200).json({
      venues: result.rows,
    });
  } catch (err) {
    console.error("Error fetching confirmed venues:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = getConfirmedVenues;
