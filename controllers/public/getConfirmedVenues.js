const pool = require("../../config/db");

const getConfirmedVenues = async (req, res) => {
  const { sort, district, search } = req.query;

  try {
    let baseQuery = `
      SELECT 
        v.venueid,
        v.name,
        v.district,
        v.address,
        v.capacity,
        v.priceperseat,
        v.phonenumber,
        v.description,
        v.status,
        v.ownerid,
        v.createdat,
        v.updatedat,
        p.photourl
      FROM venue v
      LEFT JOIN LATERAL (
        SELECT photourl
        FROM photo
        WHERE photo.venueid = v.venueid
        ORDER BY uploadedat ASC
        LIMIT 1
      ) p ON true
      WHERE v.status = 'Confirmed'
    `;

    const values = [];

    // 🔍 Search
    if (search) {
      values.push(`%${search.toLowerCase()}%`);
      baseQuery += ` AND LOWER(v.name) LIKE $${values.length}`;
    }

    // 🏙 District filter
    if (district) {
      values.push(district);
      baseQuery += ` AND v.district = $${values.length}`;
    }

    // ↕️ Sorting
    if (sort === "price_asc") {
      baseQuery += ` ORDER BY v.priceperseat ASC`;
    } else if (sort === "price_desc") {
      baseQuery += ` ORDER BY v.priceperseat DESC`;
    } else if (sort === "capacity_asc") {
      baseQuery += ` ORDER BY v.capacity ASC`;
    } else if (sort === "capacity_desc") {
      baseQuery += ` ORDER BY v.capacity DESC`;
    } else {
      baseQuery += ` ORDER BY v.createdat DESC`; // default
    }

    const result = await pool.query(baseQuery, values);

    res.json({ venues: result.rows });
  } catch (err) {
    console.error("Error in getConfirmedVenues:", err);
    res.status(500).json({ message: "Xatolik yuz berdi", error: err.message });
  }
};

module.exports = getConfirmedVenues;
