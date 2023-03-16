var DataTypes = require("sequelize/lib/data-types");

module.exports = (sequelize, Sequelize) => {
    const Loan = sequelize.define("loan", {
        id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        user_id: {
            type: Sequelize.UUID,
            allowNull: false,
        },
        loan_type: {
            type:   Sequelize.ENUM,
            values: ['Car', 'Home', 'Education', 'Personal'],
            allowNull: false,
        },
        interest_rate: {
            type: Sequelize.DOUBLE,
            allowNull: false,
        },
        loan_amount: {
            type: Sequelize.DOUBLE,
            allowNull: false,
        },
        term_period_months: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        disbursement_date:{
            type: Sequelize.DATE,
            allowNull: false,
        }
    });

    return Loan;
};
