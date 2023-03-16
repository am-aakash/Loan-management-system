var DataTypes = require("sequelize/lib/data-types");

module.exports = (sequelize, Sequelize) => {
    const Emi = sequelize.define("emi", {
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
        emi_amount: {
            type: Sequelize.DOUBLE,
            allowNull: false,
        },
        month_of_emi: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        paid: {
            type: Sequelize.BOOLEAN,
            default: false,
        }
    });

    return Emi;
};
