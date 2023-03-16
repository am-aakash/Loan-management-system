exports.emiCalculator = (loan_id, total_amount, months, monthly_interest, monthy_income, start_month) => {
    let monthly_limit = monthy_income * 0.6;
    let emiList = [];
    let month=start_month;
    let amount;

    for(; month<months; month++){
        total_amount = total_amount + total_amount * monthly_interest/100;
        let amount = total_amount / (months-start_month);
        if(amount > monthly_limit) amount = monthly_limit;

        emiList.push({amount, month});

        total_amount = total_amount - amount;
    }
    amount = total_amount;
    emiList.push({amount, month});

    return emiList;
}