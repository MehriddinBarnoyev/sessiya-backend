// controllers/admin/updateVenue.js

const pool = require("../../config/db");

const updateVenue = async (req, res) => {
    const venueId = req.params.id;
    const updates = req.body;
    const files = req.files;

    try {
        // 1. Dinamik UPDATE
        const fields = [];
        const values = [];
        let idx = 1;

        for (let key in updates) {
            fields.push(`${key} = $${idx}`);
            values.push(updates[key]);
            idx++;
        }

        fields.push(`UpdatedAt = CURRENT_TIMESTAMP`);
        values.push(venueId);

        const updateQuery = `
      UPDATE Venue SET ${fields.join(", ")}
      WHERE VenueID = $${idx}
      RETURNING *`;

        const venueRes = await pool.query(updateQuery, values);

        if (venueRes.rowCount === 0) {
            return res.status(404).json({ message: "Venue topilmadi" });
        }

        const venue = venueRes.rows[0];

        // 2. Rasmlar saqlash
        const insertedPhotos = [];
        if (files && files.length > 0) {
            for (const file of files) {
                const photoRes = await pool.query(
                    `INSERT INTO Photo (VenueID, PhotoURL) VALUES ($1, $2) RETURNING *`,
                    [venue.venueid, file.filename]
                );
                insertedPhotos.push(photoRes.rows[0]);
            }
        }

        res.json({
            message: "Venue yangilandi",
            venue,
            newPhotos: insertedPhotos,
        });
    } catch (err) {
        res.status(500).json({ message: "Server xatosi", error: err.message });
    }
};

module.exports = updateVenue;
