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

exports.searchPatients = async (req, res) => {
    const { q } = req.query;

    try {
        const [rows] = await db.query(
            `SELECT * FROM patients
             WHERE full_name LIKE ?
             OR mrn LIKE ?`,
            [`%${q}%`, `%${q}%`]
        );

        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({success: false,error: error.message});
    }
};


exports.createPatient = async (req, res) => {
    const {mrn,full_name,gender,date_of_birth,phone,national_id} = req.body;

    try {

        const [existing] = await db.query(
            "SELECT id FROM patients WHERE mrn = ?",
            [mrn]
        );

        if (existing.length > 0) {
            return res.status(400).json({success: false,message: "MRN already exists"});
        }

        const [result] = await db.query(
            `INSERT INTO patients
            (mrn, full_name, gender, date_of_birth, phone, national_id)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                mrn,
                full_name,
                gender,
                date_of_birth,
                phone || null,
                national_id || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Patient created successfully",
            patientId: result.insertId
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


exports.updatePatient = async (req, res) => {

    const { mrn } = req.params;

    const {
        full_name,
        gender,
        date_of_birth,
        phone,
        national_id
    } = req.body;

    try {

        const [result] = await db.query(
            `UPDATE patients
             SET
                full_name = ?,
                gender = ?,
                date_of_birth = ?,
                phone = ?,
                national_id = ?
             WHERE mrn = ?`,
            [
                full_name,
                gender,
                date_of_birth,
                phone || null,
                national_id || null,
                mrn
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        res.json({
            success: true,
            message: "Patient updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }

};


exports.deletePatient = async (req, res) => {

    const { mrn } = req.params;

    try {

        const [result] = await db.query(
            "DELETE FROM patients WHERE mrn = ?",
            [mrn]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        res.json({
            success: true,
            message: "Patient deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }

};