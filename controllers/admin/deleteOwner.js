const pool = require("../../config/db");

const deleteOwner = async (req, res) => {
  const { ownerId } = req.body;

  if (!ownerId) {
    return res.status(400).json({ message: "ownerId kerak" });
  }

  try {
    const result = await pool.query(
      `DELETE FROM venueowner WHERE ownerid = $1 RETURNING *`,
      [ownerId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Venue owner topilmadi" });
    }

    res.json({ message: "Venue owner o‘chirildi", owner: result.rows[0] });
  } catch (err) {
    console.error("Owner delete error:", err);
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
};

module.exports = deleteOwner;
