const express = require("express");
const router = express.Router();

const visitController = require("../controllers/visitController");

router.get(
    "/patients/:mrn/visits",
    visitController.getPatientVisits
);

router.get(
    "/patients/:mrn/current-visit",
    visitController.getCurrentVisit
);

router.post(
    "/patients/:mrn/visits",
    visitController.createVisit
);

router.put(
    "/patients/:mrn/visits/:visit_number",
    visitController.updateVisit
);

router.delete(
    "/patients/:mrn/visits/:visit_number",
    visitController.deleteVisit
);

module.exports = router;