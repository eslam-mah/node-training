const db = require("../config/db");

// 43. Check MRN exists
exports.checkMrn = async (req, res) => {

    const { mrn } = req.body;

    try {

        const [rows] = await db.query(
            "SELECT id, mrn, full_name FROM patients WHERE mrn = ?",
            [mrn]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "MRN not found"
            });
        }

        res.json({
            success: true,
            exists: true,
            patient: rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};

// 44. Mock Login
exports.mrnLogin = async (req, res) => {

    const { mrn, date_of_birth } = req.body;

    try {

        const [rows] = await db.query(
            "SELECT * FROM patients WHERE mrn = ? AND date_of_birth = ?",
            [mrn, date_of_birth]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid MRN or Date of Birth"
            });
        }

        res.json({
            success: true,
            message: "Login successful",
            token: "fake-jwt-token",
            patient: rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};

// 45. Fake Profile
exports.getMe = async (req, res) => {

    try {

        const [rows] = await db.query(
            "SELECT id, mrn, full_name, gender, date_of_birth FROM patients LIMIT 1"
        );

        res.json(rows[0]);

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};