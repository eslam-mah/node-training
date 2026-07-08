const db = require('../config/db');



exports.getLabOrders = async (req, res) => {
    try {
        const { mrn, visit_number } = req.params;

        // Step 1: Find the patient
        const [patients] = await db.query(
            "SELECT id FROM patients WHERE mrn = ?",
            [mrn]
        );

        if (patients.length === 0) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        const patientId = patients[0].id;

        // Step 2: Find the visit
        const [visits] = await db.query(
            `SELECT id
             FROM visits
             WHERE patient_id = ?
             AND visit_number = ?`,
            [patientId, visit_number]
        );

        if (visits.length === 0) {
            return res.status(404).json({
                message: "Visit not found"
            });
        }

        const visitId = visits[0].id;

        // Step 3: Get lab orders
        const [orders] = await db.query(
            `SELECT *
             FROM lab_orders
             WHERE patient_id = ?
             AND visit_id = ?`,
            [patientId, visitId]
        );

        res.status(200).json(orders);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

exports.createLabOrder = async (req, res) => {
    try {
        const { mrn, visit_number } = req.params;

        // Step 1: Find the patient
        const [patients] = await db.query(
            "SELECT id FROM patients WHERE mrn = ?",
            [mrn]
        );

        if (patients.length === 0) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        const patientId = patients[0].id;

        // Step 2: Find the visit
        const [visits] = await db.query(
            `SELECT id
             FROM visits
             WHERE patient_id = ?
             AND visit_number = ?`,
            [patientId, visit_number]
        );

        if (visits.length === 0) {
            return res.status(404).json({
                message: "Visit not found"
            });
        }

        const visitId = visits[0].id;

                // Step 3: Get data from request body
        const {
            hmis_order_id,
            order_name,
            order_date,
            status,
            requested_by
        } = req.body;

        // Step 4: Insert lab order
        const [result] = await db.query(
            `INSERT INTO lab_orders
            (
                patient_id,
                visit_id,
                hmis_order_id,
                order_name,
                order_date,
                status,
                requested_by
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                patientId,
                visitId,
                hmis_order_id,
                order_name,
                order_date,
                status,
                requested_by
            ]
        );

        // Step 5: Return success response
        res.status(201).json({
            message: "Lab order created successfully",
            orderId: result.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

exports.updateLabOrder = async (req, res) => {
    try {
        const {order_id} = req.params;

         const {
            order_name,
            status,
            requested_by
        } = req.body;
        const [result] = await db.query(
            `UPDATE lab_orders
             SET order_name = ?, status = ?, requested_by = ?
             WHERE id = ?`,
            [order_name, status, requested_by, order_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Lab order not found"
            });
        }
        res.status(200).json({
            message: "Lab order updated successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};
exports.deleteLabOrder = async (req, res) => {
    try {
        const {order_id} = req.params;
        const [result] = await db.query(
            `DELETE FROM lab_orders WHERE id = ?`,
            [order_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Lab order not found"
            });
        }
        res.status(200).json({
            message: "Lab order deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};