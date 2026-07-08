const db = require('../config/db');
exports.getPatientVisits = async (req, res) => {

    const { mrn } = req.params;

    try {

        const [rows] = await db.query(
            `SELECT v.*
             FROM visits v
             JOIN patients p
             ON v.patient_id = p.id
             WHERE p.mrn = ?`,
            [mrn]
        );

        res.status(200).json(rows);

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};

exports.getCurrentVisit = async (req, res) => {

    const { mrn } = req.params;

    try {

        const [rows] = await db.query(
            `SELECT v.*
             FROM visits v
             JOIN patients p
             ON v.patient_id = p.id
             WHERE p.mrn = ?
             AND v.is_active = TRUE`,
            [mrn]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No active visit found"
            });
        }

        res.status(200).json(rows[0]);

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};

exports.createVisit = async (req, res) => {

    const { mrn } = req.params;

    const {
        visit_number,
        department_name,
        bed_name,
        doctor_name,
        status,
        is_active,
        admission_date
    } = req.body;

    try {

        const [patient] = await db.query(
            "SELECT id FROM patients WHERE mrn = ?",
            [mrn]
        );

        if (patient.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        const patient_id = patient[0].id;

        const [existing] = await db.query(
            "SELECT id FROM visits WHERE patient_id = ? AND visit_number = ?",
            [patient_id, visit_number]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Visit already exists"
            });
        }

        const [result] = await db.query(
            `INSERT INTO visits
            (
                patient_id,
                visit_number,
                admission_date,
                department_name,
                bed_name,
                doctor_name,
                status,
                is_active
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                patient_id,
                visit_number,
                admission_date,
                department_name,
                bed_name,
                doctor_name,
                status,
                is_active
            ]
        );

        res.status(201).json({
            success: true,
            message: "Visit created successfully",
            visitId: result.insertId
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};


exports.updateVisit = async (req, res) => {

    const { mrn, visit_number } = req.params;

    const {
        department_name,
        bed_name,
        doctor_name,
        status,
        is_active
    } = req.body;

    try {

        const [result] = await db.query(
            `UPDATE visits v
             JOIN patients p
             ON v.patient_id = p.id
             SET
                v.department_name = ?,
                v.bed_name = ?,
                v.doctor_name = ?,
                v.status = ?,
                v.is_active = ?
             WHERE p.mrn = ?
             AND v.visit_number = ?`,
            [
                department_name,
                bed_name,
                doctor_name,
                status,
                is_active,
                mrn,
                visit_number
            ]
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Visit not found"
            });

        }

        res.json({
            success: true,
            message: "Visit updated successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};


exports.deleteVisit = async (req, res) => {

    const { mrn, visit_number } = req.params;

    try {

        const [result] = await db.query(
            `DELETE v
             FROM visits v
             JOIN patients p
             ON v.patient_id = p.id
             WHERE p.mrn = ?
             AND v.visit_number = ?`,
            [
                mrn,
                visit_number
            ]
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Visit not found"
            });

        }

        res.json({
            success: true,
            message: "Visit deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};