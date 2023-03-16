exports.emiCalculator = (loan_id, amount, months, monthly_interest, monthy_income, start_month) => {
    let monthly_limit = monthy_income * 0.6;
    let emiList = [];
    let current_month=0;

    for(let i=0; i<months-current_month; i++){
        amount = amount + amount * monthly_interest/100;
        let current_amount = amount / (months-start_month);
        if(current_amount > monthly_limit) current_amount = monthly_limit;
        current_month = start_month + i;

        emiList.push({current_amount, current_month});

        amount = amount - current_amount;
    }

    // Last month
    // await Emi.create({
    //     loan_id: loan_id,
    //     emi_amount: amount,
    //     month_of_emi: current_month+i,
    //     paid: false
    // });
    current_month++;
    emiList.push({amount, current_month});

    return emiList;
}