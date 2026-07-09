const express = require("express");
const router = express.Router();

const labController = require(
    "../controllers/labController"
);

router.get(
    "/:mrn/visits/:visit_number/labs/orders",
    labController.getLabOrders
);

router.post(
    "/:mrn/visits/:visit_number/labs/orders",
    labController.createLabOrder
);


router.put(
    "/orders/:order_id",
    labController.updateLabOrder
);

router.delete(
    "/orders/:order_id",
    labController.deleteLabOrder
);


router.get(
    "/:mrn/visits/:visit_number/labs/results",
    labController.getLabResults
);

router.get(
    "/:mrn/visits/:visit_number/labs/abnormal",
    labController.getAbnormalLabs
);

router.get(
    "/:mrn/visits/:visit_number/labs/timeline",
    labController.getLabTimeline
);

router.get(
    "/orders/:order_id/results",
    labController.getLabResultsByOrder
);

router.post(
    "/orders/:order_id/results",
    labController.createLabResult
);

router.put(
    "/results/:result_id",
    labController.updateLabResult
);

router.delete(
    "/results/:result_id",
    labController.deleteLabResult
);

module.exports = router;