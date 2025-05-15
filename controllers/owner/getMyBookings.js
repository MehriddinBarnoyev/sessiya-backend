const pool = require("../../config/db");

const getMyBookings = async (req, res) => {
  const ownerId = req.user.id;

  console.log("Owner ID:", ownerId);
  
  try {
    const result = await pool.query(`
    SELECT 
  b."bookingid",
  v."name" AS "VenueName",
  b."bookingdate",
  b."numberofguests",
  b."firstname" || ' ' || b."lastname" AS "UserFullName",
  b."phonenumber",
  b."status"
FROM "booking" b
JOIN "venue" v ON b."venueid" = v."venueid"
WHERE v."ownerid" = $1
ORDER BY b."bookingdate" ASC;

    `, [ownerId]);

    res.json({ bookings: result.rows });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
};

module.exports = getMyBookings;
