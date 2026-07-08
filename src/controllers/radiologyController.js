const db = require('../config/db');

exports.getRadiologyOrders = async (req, res) => {
    const { mrn, visit_number } = req.params;

    try {
        const [rows] = await db.query(
            `SELECT ro.*
             FROM radiology_orders ro
             JOIN patients p ON ro.patient_id = p.id
             JOIN visits v ON ro.visit_id = v.id
             WHERE p.mrn = ?
             AND v.visit_number = ?`,
            [mrn, visit_number]
        );

        res.status(200).json(rows);

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.getRadiologyOrderById = async (req, res) => {

    const { order_id } = req.params;

    try {

        const [rows] = await db.query(
            "SELECT * FROM radiology_orders WHERE id = ?",
            [order_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Radiology order not found"
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


exports.createRadiologyOrder = async (req, res) => {

    const { mrn, visit_number } = req.params;

    const {
        hmis_order_id,
        modality,
        study_name,
        order_date,
        status,
        requested_by
    } = req.body;

    try {

        const [patientVisit] = await db.query(
            `SELECT
                p.id AS patient_id,
                v.id AS visit_id
             FROM patients p
             JOIN visits v
               ON p.id = v.patient_id
             WHERE p.mrn = ?
             AND v.visit_number = ?`,
            [mrn, visit_number]
        );

        if (patientVisit.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Patient or visit not found"
            });
        }

        const { patient_id, visit_id } = patientVisit[0];

        const [result] = await db.query(
            `INSERT INTO radiology_orders
            (
                patient_id,
                visit_id,
                hmis_order_id,
                modality,
                study_name,
                order_date,
                status,
                requested_by
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                patient_id,
                visit_id,
                hmis_order_id,
                modality,
                study_name,
                order_date,
                status,
                requested_by
            ]
        );

        res.status(201).json({
            success: true,
            message: "Radiology order created successfully",
            orderId: result.insertId
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};


exports.updateRadiologyOrder = async (req, res) => {

    const { order_id } = req.params;

    const {
        modality,
        study_name,
        status
    } = req.body;

    try {

        const [result] = await db.query(
            `UPDATE radiology_orders
             SET
                modality = ?,
                study_name = ?,
                status = ?
             WHERE id = ?`,
            [
                modality,
                study_name,
                status,
                order_id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Radiology order not found"
            });
        }

        res.json({
            success: true,
            message: "Radiology order updated successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};

exports.deleteRadiologyOrder = async (req, res) => {

    const { order_id } = req.params;

    try {

        const [result] = await db.query(
            "DELETE FROM radiology_orders WHERE id = ?",
            [order_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Radiology order not found"
            });
        }

        res.json({
            success: true,
            message: "Radiology order deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};

exports.getRadiologyReport = async (req, res) => {

    const { order_id } = req.params;

    try {

        const [rows] = await db.query(
            "SELECT * FROM radiology_reports WHERE radiology_order_id = ?",
            [order_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Radiology report not found"
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

exports.getRadiologyTimeline = async (req, res) => {

    const { mrn, visit_number } = req.params;

    try {

        const [rows] = await db.query(
            `SELECT
                ro.id,
                ro.study_name,
                ro.modality,
                ro.order_date,
                rr.reported_at,
                rr.impression,
                ro.status
             FROM radiology_orders ro
             LEFT JOIN radiology_reports rr
             ON ro.id = rr.radiology_order_id
             JOIN patients p
             ON ro.patient_id = p.id
             JOIN visits v
             ON ro.visit_id = v.id
             WHERE p.mrn = ?
             AND v.visit_number = ?
             ORDER BY ro.order_date`,
            [mrn, visit_number]
        );

        res.status(200).json(rows);

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};


exports.createRadiologyReport = async (req, res) => {

    const { order_id } = req.params;

    const {
        report_text,
        impression,
        reported_by,
        reported_at
    } = req.body;

    try {

        const [order] = await db.query(
            "SELECT patient_id, visit_id FROM radiology_orders WHERE id = ?",
            [order_id]
        );

        if (order.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Radiology order not found"
            });
        }

        const [result] = await db.query(
            `INSERT INTO radiology_reports
            (
                radiology_order_id,
                patient_id,
                visit_id,
                report_text,
                impression,
                reported_by,
                reported_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                order_id,
                order[0].patient_id,
                order[0].visit_id,
                report_text,
                impression,
                reported_by,
                reported_at
            ]
        );

        res.status(201).json({
            success: true,
            message: "Radiology report created successfully",
            reportId: result.insertId
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};


exports.updateRadiologyReport = async (req, res) => {

    const { report_id } = req.params;

    const {
        report_text,
        impression,
        reported_by
    } = req.body;

    try {

        const [result] = await db.query(
            `UPDATE radiology_reports
             SET
                report_text = ?,
                impression = ?,
                reported_by = ?
             WHERE id = ?`,
            [
                report_text,
                impression,
                reported_by,
                report_id
            ]
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Report not found"
            });

        }

        res.json({
            success: true,
            message: "Radiology report updated successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};


exports.deleteRadiologyReport = async (req, res) => {

    const { report_id } = req.params;

    try {

        const [result] = await db.query(
            "DELETE FROM radiology_reports WHERE id = ?",
            [report_id]
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Report not found"
            });

        }

        res.json({
            success: true,
            message: "Radiology report deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};

