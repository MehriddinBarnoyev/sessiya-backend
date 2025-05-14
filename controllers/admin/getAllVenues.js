const pool = require("../../config/db");

const getAllVenues = async (req, res) =>{
    try {
        const response = await pool.query("Select * from venue");
        res.status(200).json({
            venues: response.rows
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server xatosi", error: error.message });
        
    }
}
module.exports = getAllVenues;