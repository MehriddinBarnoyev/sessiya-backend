const pool = require("../../config/db");
const path = require("path");

const addVenue = async (req, res) => {  
  const ownerId = req.user.id;  
  const {
    name,
    district,
    address,
    capacity,
    pricePerSeat,
    phoneNumber,
    description,
  } = req.body;

  const photos = req.files;

  if (!name || !district || !address || !capacity || !pricePerSeat || !phoneNumber) {
    return res.status(400).json({ message: "Majburiy maydonlar to'ldirilishi kerak" });
  }

  try {
    // 1. Venue qo‘shish
    const venueResult = await pool.query(
      `INSERT INTO venue 
      (name, district, address, capacity, priceperseat, phonenumber, description, ownerid, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Unconfirmed')
      RETURNING *`,
      [
        name,
        district,
        address,
        capacity,
        pricePerSeat,
        phoneNumber,
        description || null,
        ownerId,
      ]
    );

    const venue = venueResult.rows[0];

    // 2. Rasm(lar)ni Photo jadvaliga qo‘shish
    if (photos && photos.length > 0) {
      const insertPhotoPromises = photos.map((file) => {
        const photoUrl = `${file.filename}`;
        return pool.query(
          `INSERT INTO photo (venueid, photourl) VALUES ($1, $2)`,
          [venue.venueid, photoUrl]
        );
      });

      await Promise.all(insertPhotoPromises);
    }

    res.status(201).json({
      message: "To'yxona yaratildi. Admin tasdiqlashi kutilmoqda.",
      venue,
    });
  } catch (err) {
    console.error("Venue creation error:", err);
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
};

module.exports = addVenue;
