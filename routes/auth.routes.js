const express = require("express");
const router = express.Router();

const controller = require("../controllers/auth.controller");

router.post("/add-admin", controller.addAdmin);
router.post("/login-admin", controller.loginAdmin);
router.get("/admin-list", controller.getAdmins);
module.exports = router;