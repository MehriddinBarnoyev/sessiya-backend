// controllers/user/createBooking.js

const pool = require("../../config/db");

const createBooking = async (req, res) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    venueId,
    bookingDate,
    numberOfGuests,
  } = req.body;

  if (!firstName || !lastName || !phoneNumber || !venueId || !bookingDate || !numberOfGuests) {
    return res.status(400).json({ message: "Barcha maydonlarni to‘ldiring" });
  }

  try {
    // 1. Venue mavjudmi va tasdiqlanganmi?
    const venueRes = await pool.query(
      `SELECT * FROM Venue WHERE VenueID = $1 AND Status = 'Confirmed'`,
      [venueId]
    );
    if (venueRes.rowCount === 0) {
      return res.status(404).json({ message: "Venue topilmadi yoki tasdiqlanmagan" });
    }

    // 2. Sana bandmi?
    const checkBooking = await pool.query(
      `SELECT * FROM Booking WHERE VenueID = $1 AND BookingDate = $2`,
      [venueId, bookingDate]
    );
    if (checkBooking.rowCount > 0) {
      return res.status(400).json({ message: "Bu sana allaqachon band" });
    }

    // 3. User mavjudmi? Telefon orqali tekshir
    let user;
    const userRes = await pool.query(
      `SELECT * FROM "User" WHERE PhoneNumber = $1`,
      [phoneNumber]
    );

    if (userRes.rowCount === 0) {
      // Yo‘q bo‘lsa – insert
      const newUserRes = await pool.query(
        `INSERT INTO "User" (FirstName, LastName, PhoneNumber)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [firstName, lastName, phoneNumber]
      );
      user = newUserRes.rows[0];
    } else {
      user = userRes.rows[0];
    }

    // 4. Booking ni yaratish
    const today = new Date().toISOString().split("T")[0];
    const status = bookingDate < today ? "Past" : "Upcoming";

    const bookingRes = await pool.query(
      `INSERT INTO Booking (VenueID, UserID, BookingDate, NumberOfGuests, Status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [venueId, user.userid, bookingDate, numberOfGuests, status]
    );

    res.status(201).json({
      message: "Bron muvaffaqiyatli qo‘shildi",
      booking: bookingRes.rows[0],
    });
  } catch (err) {
    res.status(500).json({ message: "Xatolik", error: err.message });
  }
};

module.exports = createBooking;
