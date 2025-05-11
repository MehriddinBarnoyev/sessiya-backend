const pool = require("../../config/db");

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

  if (!name || !district || !address || !capacity || !pricePerSeat || !phoneNumber) {
    return res.status(400).json({ message: "Majburiy maydonlar to'ldirilishi kerak" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO Venue 
      (Name, District, Address, Capacity, PricePerSeat, PhoneNumber, Description, OwnerID, Status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Unconfirmed')
      RETURNING *`,
      [name, district, address, capacity, pricePerSeat, phoneNumber, description || null, ownerId]
    );

    res.status(201).json({
      message: "To'yxona yaratildi. Admin tasdiqlashi kutilmoqda.",
      venue: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
};

module.exports = addVenue;
