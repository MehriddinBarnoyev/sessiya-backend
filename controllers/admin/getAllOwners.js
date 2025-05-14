const pool = require("../../config/db");

const getAllOwners = async (req, res) => {    
  try {
    const result = await pool.query(`
      SELECT 
    vo.ownerid,
    vo.firstname,
    vo.lastname,
    vo.username,
    vo.phonenumber,
    vo.email,
    vo.createdat,
    COUNT(v.venueid) AS venue_count
FROM venueowner vo
LEFT JOIN venue v ON vo.ownerid = v.ownerid
GROUP BY 
    vo.ownerid,
    vo.firstname,
    vo.lastname,
    vo.username,
    vo.phonenumber,
    vo.email,
    vo.createdat
ORDER BY vo.createdat DESC;

    `);

    res.status(200).json({
      owners: result.rows,
    });
  } catch (err) {
    console.error("Error fetching venue owners:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = getAllOwners;
