const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/loan_controllers/user.controller");
const loan_controller = require("../controllers/loan_controllers/loan.controller");
const payment_controller = require("../controllers/loan_controllers/payment.controller");
const statement_controller = require("../controllers/loan_controllers/statement.controller");

router.post("/register-user", user_controller.registerUser);
router.get("/get-users", user_controller.getUsers);

router.post("/apply-loan", loan_controller.applyLoan);
router.get("/get-loans", loan_controller.getLoans);

router.post("/make-payment", payment_controller.makePayment);

router.get("/get-statement", statement_controller.getStatement);

module.exports = router;