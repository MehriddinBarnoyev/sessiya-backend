// controllers/owner/updateMyVenue.js

const pool = require("../../config/db");

const updateMyVenue = async (req, res) => {
    const venueId = req.params.id;
    const ownerId = req.user.id;
    const updates = req.body;
    const files = req.files;

    if (Object.keys(updates).length === 0 && (!files || files.length === 0)) {
        return res.status(400).json({ message: "Kamida bitta rasm yuboring" });
    }

    try {
        // 1. Tegishlilik tekshiruvi
        const check = await pool.query(
            `SELECT * FROM Venue WHERE VenueID = $1 AND OwnerID = $2`,
            [venueId, ownerId]
        );
        if (check.rowCount === 0) {
            return res.status(403).json({ message: "Bu venue sizga tegishli emas" });
        }

        // 2. Dinamik update
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
        values.push(ownerId);

        const query = `
      UPDATE Venue SET ${fields.join(", ")}
      WHERE VenueID = $${idx} AND OwnerID = $${idx + 1}
      RETURNING *`;

        const venueRes = await pool.query(query, values);
        const venue = venueRes.rows[0];

        // 3. Rasmlar saqlash
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

module.exports = updateMyVenue;
