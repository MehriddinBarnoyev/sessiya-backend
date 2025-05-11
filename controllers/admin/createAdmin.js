
const pool = require("../../config/db");
const { hashPassword } = require("../../utils/hash");
const { generateToken } = require("../../utils/jwt");

const createAdmin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Barcha maydonlarni to'ldiring" });
    }

    try {
        const hashed = await hashPassword(password);

        const check = await pool.query("SELECT * FROM Admin WHERE Username = $1", [username]);
        if (check.rows.length > 0) {
            return res.status(400).json({ message: "Username band" });
        }

        const result = await pool.query(
            `INSERT INTO Admin (Username, Password)
       VALUES ($1, $2) RETURNING *`,
            [username, hashed]
        );

        const admin = result.rows[0];
        const token = generateToken({ id: admin.adminid, role: "admin" });

        res.status(201).json({ token, admin: { id: admin.adminid, username: admin.username } });
    } catch (err) {
        res.status(500).json({ message: "Server xatosi", error: err.message });
    }
};
module.exports = createAdmin;