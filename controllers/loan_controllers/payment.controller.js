const response = require("../../helpers/response.helper");
const db = require("../../models");
const emi_calculator = require("./loan_utils/emi_calculator")
const Op = require('Sequelize').Op
const Loan = db.loan;
const Transaction = db.transaction;
const Emi = db.emi;

exports.makePayment = async (req, res) => {
    const loan_id = req.body.loan_id;
    const transaction_amount = req.body.amount;
    const month_of_transaction = req.body.month_of_transaction;

    if (
        loan_id == null ||
        loan_id === "" ||
        transaction_amount == null ||
        transaction_amount === 0 ||
        month_of_transaction == null ||
        month_of_transaction === 0
    ) {
        return response.responseHelper(
            res,
            false,
            "All fields are required",
            "Failed to Make Payment"
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
                "Failed to Make Transaction"
            );
        }

        let user = await db.user.findOne({
            where: {
                id: loan.user_id,
            },
        });

        // Check if prev emis are not due
        let emi_check = await Emi.findAll({
            where: {
                [Op.and]: [
                    {
                        loan_id: loan.id,
                        paid: false,
                        month_of_emi: {
                            [Op.lt]: month_of_transaction
                        }
                    }
                ]
            },
        })
        if (emi_check.length > 0) {
            return response.responseHelper(
                res,
                false,
                "Previous EMIs are due",
                "Failed to Make Transaction"
            );
        }

        // Check if payment done for current month
        let month_check = await Transaction.findOne({
            where: {
                loan_id: loan.id,
                month_of_transaction: month_of_transaction,
            },
        })
        if(month_check){
            return response.responseHelper(
                res,
                false,
                "EMI for this month is paid",
                "Failed to Make Transaction"
            );
        }

        // Check if amount is greater than leftover amount
        let future_emis = await Emi.findAll({
            where: {
                [Op.and]: [
                    {
                        loan_id: loan.id,
                        paid: false,
                        month_of_emi: {
                            [Op.gte]: month_of_transaction
                        }
                    }
                ]
            },
        })
        let leftAmount = 0;
        for(let emi of future_emis){
            leftAmount += emi.emi_amount;
        }
        if(transaction_amount > leftAmount){
            return response.responseHelper(
                res,
                false,
                "Transaction amount is higher than required",
                "Failed to Make Transaction"
            );
        }

        let payment = await Transaction.create({
            loan_id,
            transaction_amount,
            month_of_transaction,
        })

        leftAmount -= transaction_amount;
        
        let emiList = emi_calculator.emiCalculator(loan.id, leftAmount, loan.term_period_months, loan.interest_rate / 12, user.annual_income / 12, month_of_transaction+1);
        
        await Emi.destroy({
            where: { loan_id: loan.id }
        });

        for(let arr of emiList){
            await Emi.create({
                loan_id: loan.id,
                emi_amount: arr.amount,
                month_of_emi: arr.month,
                paid: false
            });
        }
        let emis = await db.emi.findAll({
            where: {
                loan_id: loan.id,
            },
        })

        if (payment) {
            return response.responseHelper(
                res,
                true,
                {
                    payment,
                    loan,
                    emis,
                },
                "Payment made successfully"
            );
        }
    } catch (error) {
        console.log(error);
        return response.responseHelper(res, false, "Error", "Something went wrong");
    }
}