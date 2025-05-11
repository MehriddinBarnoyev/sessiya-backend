// controllers/admin/addVenue.js

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

  if (!name || !district || !address || !capacity || !pricePerSeat || !phoneNumber || !ownerId) {
    return res.status(400).json({ message: "Barcha maydonlar to'ldirilishi kerak" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO Venue
      (Name, District, Address, Capacity, PricePerSeat, PhoneNumber, Description, OwnerID)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, district, address, capacity, pricePerSeat, phoneNumber, description || null, ownerId]
    );

    res.status(201).json({
      message: "To'yxona muvaffaqiyatli qo‘shildi",
      venue: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ message: "Xatolik yuz berdi", error: err.message });
  }
};

module.exports = addVenue;
