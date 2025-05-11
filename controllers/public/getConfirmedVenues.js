// controllers/public/getConfirmedVenues.js

const pool = require("../../config/db");

const getConfirmedVenues = async (req, res) => {
  const { sort, district, search } = req.query;

  try {
    let query = `SELECT * FROM Venue WHERE Status = 'Confirmed'`;
    const values = [];

    // 🔍 Search
    if (search) {
      values.push(`%${search.toLowerCase()}%`);
      query += ` AND LOWER(Name) LIKE $${values.length}`;
    }

    // 🏙 District filter
    if (district) {
      values.push(district);
      query += ` AND District = $${values.length}`;
    }

    // ↕️ Sorting
    if (sort === "price_asc") {
      query += ` ORDER BY PricePerSeat ASC`;
    } else if (sort === "price_desc") {
      query += ` ORDER BY PricePerSeat DESC`;
    } else if (sort === "capacity_asc") {
      query += ` ORDER BY Capacity ASC`;
    } else if (sort === "capacity_desc") {
      query += ` ORDER BY Capacity DESC`;
    } else {
      query += ` ORDER BY CreatedAt DESC`; // default
    }

    const result = await pool.query(query, values);
    res.json({ venues: result.rows });
  } catch (err) {
    res.status(500).json({ message: "Xatolik yuz berdi", error: err.message });
  }
};

module.exports = getConfirmedVenues;
