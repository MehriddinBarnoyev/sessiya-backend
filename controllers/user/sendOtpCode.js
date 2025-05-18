const otpStore = new Map(); // vaqtincha saqlash (Redis o‘rniga)

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 xonali
};

const sendOtpCode = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Telefon raqam majburiy" });
  }

  const otp = generateOtp();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 daqiqa

  otpStore.set(phoneNumber, { otp, expiresAt });

  console.log(`OTP for ${phoneNumber}: ${otp}`); // Keyinchalik SMS xizmatga ulanadi

  res.status(200).json({ message: "Tasdiqlash kodi yuborildi" });
};

module.exports = { sendOtpCode, otpStore };
