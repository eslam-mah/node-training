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
// lab results
exports.getLabResults = async (req, res) => {
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
        //GET lab results
        const [results] = await db.query(
            `SELECT *
             FROM lab_results
             WHERE patient_id = ?
             AND visit_id = ?`,
            [patientId, visitId]
        );

        res.status(200).json({
            message: "Lab results retrieved successfully",
            results
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

exports.getResultsByOrder = async (req, res) => {
    try {
        const { order_id } = req.params;

        const [results] = await db.query(
            `SELECT *
             FROM lab_results
             WHERE lab_order_id = ?`,
            [order_id]
        );

        res.status(200).json({
            message: "Lab results retrieved successfully",
            results
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};
exports.getAbnormalLabs = async (req, res) => {
    try{
     // Step 1: Find the patient
        const { mrn, visit_number } = req.params;
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

        const [results] = await db.query(
            `SELECT *
             FROM lab_results
             WHERE patient_id = ?
                AND visit_id = ?             
                AND abnormal_flag <>  'Low'`,

            [patientId, visitId]
        );

        res.status(200).json({
            message: "Abnormal lab results retrieved successfully",
            results
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};
 exports.getLabsTimeline = async (req, res) => {
    try {
        const { mrn, visit_number } = req.params;

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

        const [timeline] = await db.query(
            `SELECT *
             FROM lab_results
                WHERE patient_id = ?
                AND visit_id = ?
                ORDER BY result_date ASC`,
            [patientId, visitId]
        );

        res.status(200).json({
            message: "Lab timeline retrieved successfully",
            timeline
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

exports.createLabResult = async (req, res) => {
    try {
        const { order_id } = req.params;
        const [orders] = await db.query(
            `SELECT patient_id, visit_id
             FROM lab_orders
             WHERE id = ?`,
            [order_id]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                message: "Lab order not found"
            });
        }
        const { patient_id, visit_id } = orders[0];

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

        const [result] = await db.query(
            `INSERT INTO lab_results
            (patient_id, visit_id, test_name, result_value, numeric_value, unit, reference_range, abnormal_flag, result_status, result_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [patient_id, visit_id, test_name, result_value, numeric_value, unit, reference_range, abnormal_flag, result_status, result_date]
        );

        res.status(201).json({
            message: "Lab result created successfully",
            result: {
                id: result.insertId,
                ...req.body
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

exports.updateLabResult = async (req, res) => {
    try {
        const {result_id}= req.params;
        const {
            result_value,
            numeric_value,
            abnormal_flag,
            result_status
    }=req.body;
    const [result] = await db.query(
        `UPDATE lab_results
         SET result_value = ?, numeric_value = ?, abnormal_flag = ?, result_status = ?
         WHERE id = ?`,
        [result_value, numeric_value, abnormal_flag, result_status, result_id]
    );

    res.status(200).json({
        message: "Lab result updated successfully",
        result
    });
} catch (error) {
    console.error(error);
    res.status(500).json({
        message: "Server error"
    });
}
};
exports.deleteLabResult = async (req, res) => {
    try {
        const {result_id} = req.params;
        const [result] = await db.query(
            `DELETE FROM lab_results WHERE id = ?`,
            [result_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Lab result not found"
            });
        }
        res.status(200).json({
            message: "Lab result deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};