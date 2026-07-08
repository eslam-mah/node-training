const express = require("express");
const router = express.Router();

const radiologyController = require("../controllers/radiologyController");

router.get("/patients/:mrn/visits/:visit_number/radiology/orders",radiologyController.getRadiologyOrders);

router.get("/radiology/orders/:order_id",radiologyController.getRadiologyOrderById);

router.post("/patients/:mrn/visits/:visit_number/radiology/orders",radiologyController.createRadiologyOrder);

router.put("/radiology/orders/:order_id",radiologyController.updateRadiologyOrder);

router.delete("/radiology/orders/:order_id",radiologyController.deleteRadiologyOrder
);

module.exports = router;