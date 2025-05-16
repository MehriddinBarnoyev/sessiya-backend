// controllers/adminController.js

const pool = require("../../config/db");
const { hashPassword } = require("../../utils/hash");
const createVenueOwner = async (req, res) => {
  const { firstname, lastname, username, password, phoneNumber, email } = req.body;

  console.log("Request body:", req.body);
  
  // if (!firstName || !lastName || !username || !password || !phoneNumber) {
  //   return res.status(400).json({ message: "Barcha maydonlarni to'ldiring" });
  // }

  try {
    const check = await pool.query("SELECT * FROM VenueOwner WHERE Username = $1", [username]);
    if (check.rows.length > 0) {
      return res.status(400).json({ message: "Bu username band" });
    }

    const hashed = await hashPassword(password);
    const result = await pool.query(
      `INSERT INTO VenueOwner (FirstName, LastName, Username, Password, PhoneNumber, Email)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [firstname, lastname, username, hashed, phoneNumber, email || null]
    );

    const owner = result.rows[0];
    res.status(201).json({
      message: "To'yxona egasi muvaffaqiyatli qo'shildi",
      owner: {
        id: owner.ownerid,
        username: owner.username,
        phone: owner.phonenumber,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
};

module.exports = createVenueOwner;