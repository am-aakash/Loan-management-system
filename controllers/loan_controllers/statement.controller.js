const response = require("../../helpers/response.helper");
const db = require("../../models");
const Loan = db.loan;
const Transaction = db.transaction;
const Emi = db.emi;

exports.getStatement = async (req, res) => {
    const loan_id = req.query.loan_id;

    if (
        loan_id == null ||
        loan_id === ""
    ) {
        return response.responseHelper(
            res,
            false,
            "Loan id is required",
            "Failed to Get statement"
        );
    }

    try {
        let loan = await Loan.findOne({
            where: {
                id: loan_id,
            },
        });
        if (!loan) {
            return response.responseHelper(
                res,
                false,
                "This Loan doesn't exist",
                "Failed to Get Statement"
            );
        }

        let past_transactions = await Transaction.findAll({
            where: {
                loan_id: loan_id,
            }
        })

        let emis = await Emi.findAll({
            where: {
                loan_id: loan_id,
                paid: false,
            }
        })

        // Get list of EMIs due before the current month

        if (past_transactions || emis) {
            let transaction_list = [];
            for (let transaction of past_transactions) {
                let tempObj = {
                    "date": transaction.createdAt.toDateString(),
                    "amount_paid": transaction.transaction_amount,
                    "emi_month": transaction.month_of_transaction
                }
                transaction_list.push(tempObj);
            }
            let month = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            let emi_list = [];
            for (let emi of emis) {
                let tempObj = {
                    "amount": emi.emi_amount,
                    "emi_month": emi.month_of_emi,
                }
                emi_list.push(tempObj);
            }
            return response.responseHelper(
                res,
                true,
                {
                    loan,
                    transaction_list,
                    emi_list,
                },
                "Statement recieved"
            );
        }
    } catch (error) {
        console.log(error);
        return response.responseHelper(res, false, "Error", "Something went wrong");
    }
}