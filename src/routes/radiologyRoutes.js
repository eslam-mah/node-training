const express = require("express");
const router = express.Router();

const radiologyController = require("../controllers/radiologyController");

router.get("/radiology/orders/:order_id/report",radiologyController.getRadiologyReport);

router.get("/patients/:mrn/visits/:visit_number/radiology/timeline",radiologyController.getRadiologyTimeline);

router.post("/radiology/orders/:order_id/report",radiologyController.createRadiologyReport);

router.put("/radiology/reports/:report_id",radiologyController.updateRadiologyReport);

router.delete("/radiology/reports/:report_id",radiologyController.deleteRadiologyReport);

router.get("/patients/:mrn/visits/:visit_number/radiology/orders",radiologyController.getRadiologyOrders);

router.get("/radiology/orders/:order_id",radiologyController.getRadiologyOrderById);

router.post("/patients/:mrn/visits/:visit_number/radiology/orders",radiologyController.createRadiologyOrder);

router.put("/radiology/orders/:order_id",radiologyController.updateRadiologyOrder);

router.delete("/radiology/orders/:order_id",radiologyController.deleteRadiologyOrder);

module.exports = router;