const pool = require("../../config/db");

const getVenuesByOwner = async (req, res) => {
  const { ownerId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        venueid,
        name,
        district,
        address,
        capacity,
        priceperseat,
        phonenumber,
        description,
        status,
        createdat,
        updatedat
      FROM venue
      WHERE ownerid = $1
      ORDER BY createdat DESC`,
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
