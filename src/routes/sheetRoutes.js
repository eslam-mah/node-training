const express = require('express');
const router = express.Router();
const sheetController = require('../controllers/sheetController');

router.get(
    '/patients/:mrn/visits/:visit_number/sheets',
    sheetController.getPatientSheets
);
router.get('/sheets/:sheet_id', sheetController.getOneSheet);
router.get('/patients/:mrn/visits/:visit_number/sheets/:sheet_code', sheetController.getSheetByCode);
router.post('/patients/:mrn/visits/:visit_number/sheets', sheetController.createMedicalSheet);
router.put('/sheets/:sheet_id', sheetController.updateMedicalSheet);
router.delete('/sheets/:sheet_id', sheetController.deleteMedicalSheet);
router.get('/sheets/:sheet_id/fields', sheetController.getSheetFields);
router.post('/sheets/:sheet_id/fields', sheetController.createSheetField);
router.put('/sheets/:sheet_id/fields/:field_key', sheetController.updateSheetField);
router.delete('/sheets/:sheet_id/fields/:field_key', sheetController.deleteSheetField);
module.exports = router;