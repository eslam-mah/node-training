const express = require("express");
const router = express.Router();

const visitController = require("../controllers/visitController");

// Get all visits for a patient
router.get("/:mrn/visits", visitController.getPatientVisits);

// Get current active visit
router.get("/:mrn/current-visit", visitController.getCurrentVisit);

// Create visit
router.post("/:mrn/visits", visitController.createVisit);

// Update visit
router.put("/:mrn/visits/:visit_number", visitController.updateVisit);

// Delete visit
router.delete("/:mrn/visits/:visit_number", visitController.deleteVisit);

module.exports = router;