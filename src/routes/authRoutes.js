const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/auth/check-mrn", authController.checkMrn);

router.post("/auth/mrn-login", authController.mrnLogin);

router.get("/me", authController.getMe);

module.exports = router;