// controllers/user/getMyBookings.js

const pool = require("../../config/db");

const getMyBookings = async (req, res) => {
    const { phoneNumber } = req.query;

    console.log("Phone number:", phoneNumber);

    if (!phoneNumber) {
        return res.status(400).json({ message: "Telefon raqam kerak" });
    }

    try {
        const result = await pool.query(
            `
            SELECT 
            b.bookingid,
            v.name AS venuename,
            v.district,
            b.bookingdate,
            b.numberofguests,
            b.firstname || ' ' || b.lastname AS userfullname,
            b.phonenumber,
            b.status
            FROM booking b
            JOIN venue v ON b.venueid = v.venueid
            WHERE b.phonenumber = $1
            ORDER BY b.bookingdate ASC;

            `,
            [phoneNumber]
        );

        res.json({ bookings: result.rows });
    } catch (err) {
        res.status(500).json({ message: "Xatolik", error: err.message });
    }
};

module.exports = getMyBookings;
