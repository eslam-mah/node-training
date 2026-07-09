const db = require("../config/db");

// GET ALL LAB ORDERS FOR VISIT
exports.getLabOrders = async (req, res) => {
    try {
        const { mrn, visit_number } = req.params;

        const [orders] = await db.query(`
            SELECT lo.*
            FROM lab_orders lo
            JOIN patients p ON lo.patient_id = p.id
            JOIN visits v ON lo.visit_id = v.id
            WHERE p.mrn = ?
            AND v.visit_number = ?
            ORDER BY lo.order_date DESC
        `, [mrn, visit_number]);

        res.json(orders);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// CREATE LAB ORDER
exports.createLabOrder = async (req, res) => {
    try {
        const { mrn, visit_number } = req.params;

        const {
            hmis_order_id,
            order_name,
            order_date,
            status,
            requested_by
        } = req.body;

        const [visit] = await db.query(`
            SELECT
                p.id AS patient_id,
                v.id AS visit_id
            FROM patients p
            JOIN visits v
                ON p.id = v.patient_id
            WHERE p.mrn = ?
            AND v.visit_number = ?
        `, [mrn, visit_number]);

        if (visit.length === 0) {
            return res.status(404).json({
                message: "Visit not found"
            });
        }

        const patientId = visit[0].patient_id;
        const visitId = visit[0].visit_id;

        await db.query(`
            INSERT INTO lab_orders (
                patient_id,
                visit_id,
                hmis_order_id,
                order_name,
                order_date,
                status,
                requested_by
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            patientId,
            visitId,
            hmis_order_id,
            order_name,
            order_date,
            status,
            requested_by
        ]);

        res.status(201).json({
            message: "Lab order created successfully"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// UPDATE LAB ORDER
exports.updateLabOrder = async (req, res) => {
    try {
        const { order_id } = req.params;

        const {
            order_name,
            status,
            requested_by
        } = req.body;

        const [result] = await db.query(`
            UPDATE lab_orders
            SET
                order_name = ?,
                status = ?,
                requested_by = ?
            WHERE id = ?
        `, [
            order_name,
            status,
            requested_by,
            order_id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Lab order not found"
            });
        }

        res.json({
            message: "Lab order updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// DELETE LAB ORDER
exports.deleteLabOrder = async (req, res) => {
    try {
        const { order_id } = req.params;

        const [result] = await db.query(
            `DELETE FROM lab_orders WHERE id = ?`,
            [order_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Lab order not found"
            });
        }

        res.json({
            message: "Lab order deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};
exports.getLabResults = async (req, res) => {
    try {
        const { mrn, visit_number } = req.params;

        const [results] = await db.query(`
            SELECT lr.*
            FROM lab_results lr
            JOIN patients p ON lr.patient_id = p.id
            JOIN visits v ON lr.visit_id = v.id
            WHERE p.mrn = ?
            AND v.visit_number = ?
            ORDER BY lr.result_date DESC
        `, [mrn, visit_number]);

        res.json(results);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET RESULTS BY ORDER
exports.getLabResultsByOrder = async (req, res) => {
    try {
        const { order_id } = req.params;

        const [results] = await db.query(`
            SELECT *
            FROM lab_results
            WHERE lab_order_id = ?
            ORDER BY result_date DESC
        `, [order_id]);

        res.json(results);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ABNORMAL RESULTS ONLY
exports.getAbnormalLabs = async (req, res) => {
    try {
        const { mrn, visit_number } = req.params;

        const [results] = await db.query(`
            SELECT lr.*
            FROM lab_results lr
            JOIN patients p ON lr.patient_id = p.id
            JOIN visits v ON lr.visit_id = v.id
            WHERE p.mrn = ?
            AND v.visit_number = ?
            AND lr.abnormal_flag IS NOT NULL
            AND lr.abnormal_flag <> ''
            ORDER BY lr.result_date DESC
        `, [mrn, visit_number]);

        res.json(results);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET TIMELINE VIEW
exports.getLabTimeline = async (req, res) => {
    try {
        const { mrn, visit_number } = req.params;

        const [results] = await db.query(`
            SELECT
                DATE(result_date) AS lab_date,
                COUNT(*) AS total_results
            FROM lab_results lr
            JOIN patients p ON lr.patient_id = p.id
            JOIN visits v ON lr.visit_id = v.id
            WHERE p.mrn = ?
            AND v.visit_number = ?
            GROUP BY DATE(result_date)
            ORDER BY lab_date DESC
        `, [mrn, visit_number]);

        res.json(results);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// CREATE LAB RESULT
exports.createLabResult = async (req, res) => {
    try {
        const { order_id } = req.params;

        const {
            test_name,
            result_value,
            numeric_value,
            unit,
            reference_range,
            abnormal_flag,
            result_status,
            result_date
        } = req.body;

        const [order] = await db.query(`
            SELECT patient_id, visit_id
            FROM lab_orders
            WHERE id = ?
        `, [order_id]);

        if (order.length === 0) {
            return res.status(404).json({
                message: "Lab order not found"
            });
        }

        await db.query(`
            INSERT INTO lab_results (
                lab_order_id,
                patient_id,
                visit_id,
                test_name,
                result_value,
                numeric_value,
                unit,
                reference_range,
                abnormal_flag,
                result_status,
                result_date
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            order_id,
            order[0].patient_id,
            order[0].visit_id,
            test_name,
            result_value,
            numeric_value,
            unit,
            reference_range,
            abnormal_flag,
            result_status,
            result_date
        ]);

        res.status(201).json({
            message: "Lab result created successfully"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// UPDATE LAB RESULT
exports.updateLabResult = async (req, res) => {
    try {
        const { result_id } = req.params;

        const {
            result_value,
            numeric_value,
            abnormal_flag,
            result_status
        } = req.body;

        const [result] = await db.query(`
            UPDATE lab_results
            SET
                result_value = ?,
                numeric_value = ?,
                abnormal_flag = ?,
                result_status = ?
            WHERE id = ?
        `, [
            result_value,
            numeric_value,
            abnormal_flag,
            result_status,
            result_id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Lab result not found"
            });
        }

        res.json({
            message: "Lab result updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// DELETE LAB RESULT
exports.deleteLabResult = async (req, res) => {
    try {
        const { result_id } = req.params;

        const [result] = await db.query(
            `DELETE FROM lab_results WHERE id = ?`,
            [result_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Lab result not found"
            });
        }

        res.json({
            message: "Lab result deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};