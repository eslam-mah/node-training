const db = require('../config/db');
//get patient sheets
exports.getPatientSheets = async (req, res) => {
    const {mrn, visit_number} = req.params;
    try{
        const[rows] = await db.query
        ('SELECT ms.* FROM medical_sheets ms JOIN visits v ON ms.visit_id = v.id JOIN patients p ON v.patient_id = p.id WHERE p.mrn = ? AND v.visit_number = ?', 
            [mrn, visit_number]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "No medical sheets found" });
        }
    res.status(200).json(rows);
    }
    catch (error){
        res.status(500).json({ success: false, error: error.message });
    }
};
//get one sheet details
exports.getOneSheet = async(req, res) =>{
    const {sheet_id} = req.params;
    try{
        const[rows] = await db.query('SELECT * FROM medical_sheets WHERE id = ?', [sheet_id]);
        res.status(200).json(rows);
    }
    catch(error){
        res.status(500).json({ success: false, error: error.message });
    }
};
//get sheet by code 
exports.getSheetByCode = async(req, res) =>{
    const {mrn, visit_number, sheet_code} = req.params;
    try{
        const[rows] = await db.query(`SELECT ms.*
     FROM medical_sheets ms
     JOIN visits v ON ms.visit_id = v.id
     JOIN patients p ON v.patient_id = p.id
     WHERE p.mrn = ?
       AND v.visit_number = ?
       AND ms.sheet_code = ?`,
    [mrn, visit_number, sheet_code])
    res.status(200).json(rows);
    }
    catch(error){
        res.status(500).json({ success: false, error: error.message });
    }
};
//create medical sheet
exports.createMedicalSheet = async(req, res) =>{
    const {mrn, visit_number} = req.params;
    const {
        sheet_code, sheet_name, sequence, category,status, created_by, updated_by
    } = req.body;
    try {
        const [rows] = await db.query(
            `SELECT
                p.id AS patient_id,
                v.id AS visit_id
            FROM visits v
            JOIN patients p ON v.patient_id = p.id
            WHERE p.mrn = ?
            AND v.visit_number = ?`,
            [mrn, visit_number]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Visit not found"
            });
        }

        const patient_id = rows[0].patient_id;
        const visit_id = rows[0].visit_id; 
        await db.query(
            `INSERT INTO medical_sheets
            (patient_id, visit_id, sheet_code, sheet_name, sequence, category, status, created_by, parse_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [   
                patient_id,
                visit_id,
                sheet_code,
                sheet_name,
                sequence,
                category,
                status,
                created_by,
                'pending'            ]
        );

        res.status(200).json(rows);

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
//update medical sheet
exports.updateMedicalSheet = async (req, res) => {
    const { sheet_id } = req.params;

    const {
        sheet_name,
        status,
        parse_status,
        sheet_code
    } = req.body;

    try {
        const [rows] = await db.query(
            `UPDATE medical_sheets
             SET sheet_name = ?,
                 status = ?,
                 parse_status = ?,
                 sheet_code = ?
             WHERE id = ?`,
            [sheet_name, status, parse_status, sheet_code, sheet_id]
        );

        if (rows.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Medical sheet not found"
            });
        }

        res.status(200).json(rows);

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
// delete medical sheet
exports.deleteMedicalSheet = async (req, res) => {
    const { sheet_id } = req.params;

    try {
        const [rows] = await db.query(
            "DELETE FROM medical_sheets WHERE id = ?",
            [sheet_id]
        );

        if (rows.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Medical sheet not found"
            });
        }

        res.status(200).json(rows);

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
//get sheet fields
exports.getSheetFields = async (req, res) => {
    const { sheet_id } = req.params;

    try {
        const [rows] = await db.query(
            `SELECT *
             FROM sheet_fields
             WHERE sheet_id = ?`,
            [sheet_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No fields found for this sheet"
            });
        }

        res.status(200).json(rows);

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
//create sheet field
exports.createSheetField = async (req, res) => {
    const { sheet_id } = req.params;
    const {
        field_key,
        field_label,
        value_text,
        value_type,
        display_order,
        section_name
    } = req.body; 
    try{
        const [rows] = await db.query(`SELECT id FROM medical_sheets WHERE id = ?`, [sheet_id]);
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Medical sheet not found"
            });
        }
        const [result] = await db.query(
            `INSERT INTO sheet_fields
            (sheet_id, field_key, field_label, value_text, value_type, display_order, section_name)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [sheet_id, field_key, field_label, value_text, value_type, display_order, section_name]
        );
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
//update sheet field
exports.updateSheetField = async (req, res) => {
    const { sheet_id, field_key } = req.params;
    const{
        field_label,
        value_text,
        display_order,
        section_name
    } = req.body;
    try{
        const [rows] = await db.query(
            `UPDATE sheet_fields SET field_label = ?, value_text = ?, display_order = ?, section_name = ?
             WHERE sheet_id = ? AND field_key = ?`,
            [field_label, value_text, display_order, section_name, sheet_id, field_key]
        );
        if(rows.affectedRows === 0){
            return res.status(404).json({
                success: false,
                message: "Sheet field not found"
            });
        }
        res.status(200).json(rows);
    }catch(error){
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
//delete sheet field
exports.deleteSheetField = async (req, res) => {
    const { sheet_id, field_key } = req.params;
    try{
        const [rows] = await db.query(`DELETE FROM sheet_fields WHERE sheet_id = ? AND field_key = ?`, [sheet_id, field_key]);
        if(rows.affectedRows === 0){
            return res.status(404).json({
                success: false,
                message: "Sheet field not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Sheet field deleted successfully"
        });
    }catch(error){
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};