const express = require("express");
const router = express.Router();

const labController = require("../controllers/labController");

// ---------- Lab Orders ----------
router.get(
    "/patients/:mrn/visits/:visit_number/labs/orders",
    labController.getLabOrders
);

router.post(
    "/patients/:mrn/visits/:visit_number/labs/orders",
    labController.createLabOrder
);

router.put(
    "/labs/orders/:order_id",
    labController.updateLabOrder
);

router.delete(
    "/labs/orders/:order_id",
    labController.deleteLabOrder
);

// ---------- Lab Results ----------
// router.get(
//     "/patients/:mrn/visits/:visit_number/labs/results",
//     labController.getLabResults
// );

// router.get(
//     "/labs/orders/:order_id/results",
//     labController.getResultsByOrder
// );

// router.get(
//     "/patients/:mrn/visits/:visit_number/labs/abnormal",
//     labController.getAbnormalLabs
// );

// router.get(
//     "/patients/:mrn/visits/:visit_number/labs/timeline",
//     labController.getLabsTimeline
// );

// router.post(
//     "/labs/orders/:order_id/results",
//     labController.createLabResult
// );

// router.put(
//     "/labs/results/:result_id",
//     labController.updateLabResult
// );

// router.delete(
//     "/labs/results/:result_id",
//     labController.deleteLabResult
// );

module.exports = router;