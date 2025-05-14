// controllers/user/createBooking.js

const pool = require("../../config/db");

const createBooking = async (req, res) => {
  const { venueId } = req.params;
  console.log("Venue ID:", venueId);

  const {
    firstName,
    lastName,
    phoneNumber,
    bookingDate,
    numberOfGuests,
  } = req.body;

  console.log("Request Body:", req.body);

  if (!firstName || !lastName || !phoneNumber || !bookingDate || !numberOfGuests) {
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

    // 3. Booking ni yaratish (endi UserID kerak emas)
    const today = new Date().toISOString().split("T")[0];
    const status = bookingDate < today ? "Past" : "Upcoming";

    const bookingRes = await pool.query(
      `INSERT INTO Booking (VenueID, BookingDate, NumberOfGuests, Status, FirstName, LastName, PhoneNumber)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [venueId, bookingDate, numberOfGuests, status, firstName, lastName, phoneNumber]
    );

    res.status(201).json({
      message: "Bron muvaffaqiyatli qo‘shildi",
      booking: bookingRes.rows[0],
    });
  } catch (err) {
    console.error("Xatolik:", err);
    res.status(500).json({ message: "Serverda xatolik", error: err.message });
  }
};

module.exports = createBooking;
