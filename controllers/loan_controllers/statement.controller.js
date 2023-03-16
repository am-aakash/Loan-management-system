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
        if(!loan){
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
            return response.responseHelper(
                res,
                true,
                {
                    loan,
                    past_transactions,
                    emis,
                },
                "Statement recieved"
            );
        }
    } catch (error) {
        console.log(error);
        return response.responseHelper(res, false, "Error", "Something went wrong");
    }
}