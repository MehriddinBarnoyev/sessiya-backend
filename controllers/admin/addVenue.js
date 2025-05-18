const pool = require("../../config/db");

const addVenue = async (req, res) => {
  const data = req.body;
  const files = req.files;

  console.log("addVenue called");
  console.log("req.body:", data);
  console.log("req.files:", files);

  try {
    // 1. Kerakli maydonlar borligini tekshirish
    const requiredFields = [
      "name",
      "description",
      "capacity",
      "pricePerSeat",
      "district",
      "address",
      "ownerId"
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    // 2. Venue qo‘shish
    const insertQuery =
      `INSERT INTO venue
    (name, description, capacity, priceperseat, district, address, phonenumber, ownerid, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Unconfirmed')
    RETURNING *`;

    const values = [
      data.name,
      data.description,
      Number(data.capacity),
      Number(data.pricePerSeat),
      data.district,
      data.address,
      data.phoneNumber || null,
      data.ownerId,
    ];

    const result = await pool.query(insertQuery, values);
    const newVenue = result.rows[0];

    // 3. Rasmlarni Photo jadvaliga yozish
    const insertedPhotos = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const photoRes = await pool.query(
          `INSERT INTO Photo (VenueID, PhotoURL) VALUES ($1, $2) RETURNING *`,
          [newVenue.venueid, file.filename]
        );
        insertedPhotos.push(photoRes.rows[0]);
      }

      res.status(201).json({
        message: "Venue qo‘shildi",
        venue: newVenue,
        photos: insertedPhotos,
      });
    }
  } catch (error) {
    console.error("Error in addVenue:", error);
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

module.exports = addVenue;