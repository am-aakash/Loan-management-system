const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/loan_controllers/user.controller");
const loan_controller = require("../controllers/loan_controllers/loan.controller");
const payment_controller = require("../controllers/loan_controllers/payment.controller");
const statement_controller = require("../controllers/loan_controllers/statement.controller");
const verifyToken = require('../middleware/verifySignedIn');

router.post("/register-user", verifyToken, user_controller.registerUser);
router.get("/get-users", verifyToken, user_controller.getUsers);

router.post("/apply-loan", verifyToken, loan_controller.applyLoan);
router.get("/get-loans", verifyToken, loan_controller.getLoans);

router.post("/make-payment", verifyToken, payment_controller.makePayment);

router.get("/get-statement", verifyToken, statement_controller.getStatement);

module.exports = router;