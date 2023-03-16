const response = require("../../helpers/response.helper");
const db = require("../../models");
const emi_calculator = require("./loan_utils/emi_calculator")
const Loan = db.loan;
const User = db.user;
const Emi = db.emi;

exports.applyLoan = async (req, res) => {
    const user_id = req.body.user_id;
    const loan_type = req.body.loan_type;
    const interest_rate = req.body.interest_rate;
    const loan_amount = req.body.loan_amount;
    const term_period_months = req.body.term_period_months;
    const disbursement_date = req.body.disbursement_date;

    if (
        user_id == null ||
        user_id === "" ||
        loan_type == null ||
        loan_type === "" ||
        loan_amount == null ||
        loan_amount === "" ||
        term_period_months == null ||
        term_period_months === "" ||
        disbursement_date == null ||
        disbursement_date === ""
    ) {
        return response.responseHelper(
            res,
            false,
            "All fields are required",
            "Failed to Apply Loan"
        );
    }

    let loan_types = {};
    loan_types["Car"] = 750000;
    loan_types["Home"] = 8500000;
    loan_types["Education"] = 5000000;
    loan_types["Personal"] = 1000000;

    if (loan_amount > loan_types[loan_type]) {
        return response.responseHelper(
            res,
            false,
            "Enter a valid loan amount",
            "Failed to Apply Loan"
        );
    }

    if (interest_rate < 14) {
        return response.responseHelper(
            res,
            false,
            "Interest Rate should be >=14%",
            "Failed to Apply Loan"
        );
    }

    try {
        let user = await User.findOne({
            where: {
                id: user_id,
            },
        });
        if (!user) {
            return response.responseHelper(
                res,
                false,
                "This User doesn't exist",
                "Failed to Apply Loan"
            );
        }

        if (user.annual_income < 150000) {
            return response.responseHelper(
                res,
                false,
                "This Annual income is lower than 150000",
                "Failed to Apply Loan"
            );
        }
        if (user.credit_score < 450) {
            return response.responseHelper(
                res,
                false,
                "This Credit score is lower than 450",
                "Failed to Apply Loan"
            );
        }

        let loan = await Loan.create({
            user_id,
            loan_type,
            interest_rate,
            loan_amount,
            term_period_months,
            disbursement_date
        })

        let emiList = emi_calculator.emiCalculator(loan.id, loan_amount, term_period_months, interest_rate / 12, user.annual_income / 12, 1);
        
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
        
        if (loan) {
            return response.responseHelper(
                res,
                true,
                {
                    loan,
                    EMIs: emiList,
                },
                "Loan Application successful"
            );
        }
    } catch (error) {
        console.log(error);
        return response.responseHelper(res, false, "Error", "Something went wrong");
    }
}

// Test API only
exports.getLoans = async (req, res) => {
    try {
        var loans = await Loan.findAll();

        return response.responseHelper(
            res,
            true,
            {
                loans,
            },
            "loans found"
        );
    } catch (err) {
        console.log(err.message);
        return response.responseHelper(
            res,
            false,
            "Something went wrong",
            "Get loans failed"
        );
    }
};