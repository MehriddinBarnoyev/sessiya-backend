const pool = require("../../config/db");
const { otpStore } = require("./sendOtpCode"); // bir xil joyda saqlanyapti

const cancelMyBooking = async (req, res) => {
  const bookingId = req.params.id;
  const { phoneNumber, code } = req.body;

  if (!phoneNumber || !code) {
    return res.status(400).json({ message: "Telefon raqam va kod kerak" });
  }

  const stored = otpStore.get(phoneNumber);
  if (!stored) {
    return res.status(400).json({ message: "Kodni so‘rash kerak" });
  }

  if (stored.expiresAt < Date.now()) {
    otpStore.delete(phoneNumber);
    return res.status(400).json({ message: "Kod eskirgan" });
  }

  if (stored.otp !== code) {
    return res.status(400).json({ message: "Kod noto‘g‘ri" });
  }

  try {
    const result = await pool.query(
      `DELETE FROM booking
       WHERE bookingid = $1 AND phonenumber = $2
       RETURNING *`,
      [bookingId, phoneNumber]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Bron topilmadi yoki bu sizning emas" });
    }

    // OTPni o‘chirib tashlash
    otpStore.delete(phoneNumber);

    res.json({ message: "Bron bekor qilindi", booking: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
};

module.exports = cancelMyBooking;
