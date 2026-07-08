const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

router.get('/', patientController.getAllPatients);     
router.get('/search', patientController.searchPatients);
router.get('/:mrn', patientController.getPatientByMrn);   
router.post('/', patientController.createPatient);
router.put('/:mrn', patientController.updatePatient);
router.delete('/:mrn', patientController.deletePatient);
module.exports = router;