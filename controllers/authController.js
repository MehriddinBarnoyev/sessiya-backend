// controllers/authController.js
const pool = require("../config/db");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");
const { encodeID } = require("../utils/idHash");


// Venue Owner register
const registerOwner = async (req, res) => {
    const { firstName, lastName, username, password, phoneNumber, email } = req.body;

    if (!firstName || !lastName || !username || !password || !phoneNumber) {
        return res.status(400).json({ message: "Barcha maydonlarni to'ldiring" });
    }

    try {
        const hashed = await hashPassword(password);

        const check = await pool.query("SELECT * FROM VenueOwner WHERE Username = $1", [username]);
        if (check.rows.length > 0) {
            return res.status(400).json({ message: "Username band" });
        }

        const result = await pool.query(
            `INSERT INTO VenueOwner (FirstName, LastName, Username, Password, PhoneNumber, Email)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [firstName, lastName, username, hashed, phoneNumber, email || null]
        );
        const owner = result.rows[0];
        const token = generateToken({ id: owner.ownerid, role: "owner" });

        res.status(201).json({ token, owner: { id: owner.ownerid, username: owner.username } });
    } catch (err) {
        res.status(500).json({ message: "Server xatosi", error: err.message });
    }
};

// Venue Owner login
const loginOwner = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query("SELECT * FROM VenueOwner WHERE Username = $1", [username]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Bunday foydalanuvchi yo'q" });
        }

        const owner = result.rows[0];
        const isMatch = await comparePassword(password, owner.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Parol noto'g'ri" });
        }

        const token = generateToken({ id: owner.ownerid, role: "owner" });
        res.json({ token, owner: { id: owner.ownerid, username: owner.username } });
    } catch (err) {
        res.status(500).json({ message: "Server xatosi", error: err.message });
    }
};

// Admin login
const loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query("SELECT * FROM Admin WHERE Username = $1", [username]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Admin topilmadi" });
        }

        const admin = result.rows[0];
        const isMatch = await comparePassword(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Parol noto'g'ri" });
        }

        const token = generateToken({ id: admin.adminid, role: "admin" });
        res.json({ token, admin: { id: admin.adminid, username: admin.username } });
    } catch (err) {
        res.status(500).json({ message: "Server xatosi", error: err.message });
    }
};


module.exports = {
    registerOwner,
    loginOwner,
    loginAdmin,
    
};
