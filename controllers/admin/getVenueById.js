const pool = require("../../config/db");

const getVenueById = async (req, res) => {
    const venueId = req.params.id;
    try {
        const result = await pool.query(`SELECT 
        v.*,
        COALESCE(json_agg(DISTINCT p.PhotoURL) FILTER (WHERE p.PhotoURL IS NOT NULL), '[]') AS photos,
        COALESCE(json_agg(DISTINCT b.bookingdate) FILTER (WHERE b.bookingdate IS NOT NULL), '[]') AS bookedDates
      FROM Venue v
      LEFT JOIN Photo p ON v.VenueID = p.VenueID
      LEFT JOIN Booking b ON v.VenueID = b.VenueID
      WHERE v.VenueID = $1
      GROUP BY v.VenueID;`, [venueId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Venue topilmadi" });
        }

        res.status(200).json({
            owners: result.rows,
        });
    } catch (err) {
        res.status(500).json({ message: "Server xatosi", error: err.message });
    }
};
module.exports = getVenueById;