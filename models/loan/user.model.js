var DataTypes = require("sequelize/lib/data-types");

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        aadhar_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        annual_income: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        credit_score: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    });

    return User;
};
