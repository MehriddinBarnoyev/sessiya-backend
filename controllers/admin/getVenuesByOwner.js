const pool = require("../../config/db");

const getVenuesByOwner = async (req, res) => {
  const { ownerId } = req.body;

  try {
    const result = await pool.query(
      `SELECT 
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
  p.photourl
FROM venue v
LEFT JOIN LATERAL (
  SELECT photourl
  FROM photo
  WHERE photo.venueid = v.venueid
  ORDER BY photo.uploadedat ASC
  LIMIT 1
) p ON true
WHERE v.ownerid = $1
ORDER BY v.createdat DESC;

      `,
      [ownerId]
    );

    res.status(200).json({
      venues: result.rows,
    });
  } catch (error) {
    console.error("Error fetching venues by owner:", error);
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

module.exports = getVenuesByOwner;
