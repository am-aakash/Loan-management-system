var DataTypes = require("sequelize/lib/data-types");

module.exports = (sequelize, Sequelize) => {
    const Transaction = sequelize.define("transaction", {
        id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        loan_id: {
            type: Sequelize.UUID,
            allowNull: false,
        },
        transaction_amount: {
            type: Sequelize.DOUBLE,
            allowNull: false,
        },
        month_of_transaction: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }
    });

    return Transaction;
};
