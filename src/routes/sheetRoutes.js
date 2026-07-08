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

module.exports = router;