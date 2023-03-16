const response = require("../../../helpers/response.helper");
const db = require("../../../models");
const Emi = db.emi;

exports.emiCalculator = async (loan_id, amount, months, monthly_interest, monthy_income, current_month) => {
    // await Emi.destroy({
    //     where: { loan_id: loan_id }
    // });
    let monthly_limit = monthy_income * 0.6;
    let emiList = [];
    let i=0;

    for(; i<months-current_month; i++){
        amount = amount + amount * monthly_interest/100;
        let current_amount = amount / (months-current_month);
        if(current_amount > monthly_limit) current_amount = monthly_limit;

        await Emi.create({
            loan_id: loan_id,
            emi_amount: current_amount,
            month_of_emi: current_month+i,
            paid: false
        });

        amount = amount - current_amount;
    }
    
    // Last month
    await Emi.create({
        loan_id: loan_id,
        emi_amount: amount,
        month_of_emi: current_month+i,
        paid: false
    });
}