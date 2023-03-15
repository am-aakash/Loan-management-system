const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/loan_controllers/user.controller");
const loan_controller = require("../controllers/loan_controllers/loan.controller");
const payment_controller = require("../controllers/loan_controllers/payment.controller");
const statement_controller = require("../controllers/loan_controllers/statement.controller");

router.post("/register-user", user_controller.registerUser);
router.get("/get-users", user_controller.getUsers);

module.exports = router;