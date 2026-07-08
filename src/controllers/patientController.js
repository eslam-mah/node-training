const db = require('../config/db');
exports.getAllPatients = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM patients');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


exports.getPatientByMrn = async (req, res) => {
    const { mrn } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM patients WHERE mrn = ?', [mrn]);
        
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Patient not found" });
        }
        
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

