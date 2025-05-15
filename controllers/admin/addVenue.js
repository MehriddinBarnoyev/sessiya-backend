const pool = require("../../config/db");

const addVenue = async (req, res) => {
    
  const {
    name,
    district,
    address,
    capacity,
    pricePerSeat,
    phoneNumber,
    description,
    ownerId,
  } = req.body;  
  const photos = req.files;

  if (!name || !district || !address || !capacity || !pricePerSeat || !phoneNumber || !ownerId) {
    return res.status(400).json({ message: "Barcha maydonlar to‘ldirilishi kerak" });
  }

  try {
    // 1. Create the venue
    const venueResult = await pool.query(
      `INSERT INTO venue
      (name, district, address, capacity, priceperseat, phonenumber, description, ownerid, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Unconfirmed')
      RETURNING *`,
      [name, district, address, capacity, pricePerSeat, phoneNumber, description || null, ownerId]
    );

    const venue = venueResult.rows[0];

    // 2. Save images if provided
    if (photos && photos.length > 0) {
      const insertPhotos = photos.map((file) => {
        const photoUrl = `/uploads/${file.filename}`;
        return pool.query(
          `INSERT INTO photo (venueid, photourl) VALUES ($1, $2)`,
          [venue.venueid, photoUrl]
        );
      });

      await Promise.all(insertPhotos);
    }

    res.status(201).json({
      message: "To‘yxona muvaffaqiyatli qo‘shildi",
      venue,
    });
  } catch (err) {
    console.error("Add venue error:", err);
    res.status(500).json({ message: "Xatolik yuz berdi", error: err.message });
  }
};

module.exports = addVenue;
