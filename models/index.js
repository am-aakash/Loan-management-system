const Sequelize = require("sequelize");
const config = require("../config/db.config");

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  port: config.port,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};
db.sequelize = sequelize;

// Admin table
db.admin = require("./admin/admin.model")(sequelize, Sequelize);

// User table
db.user = require("./loan/user.model")(sequelize, Sequelize);

// Loan Table
db.loan = require("./loan/loan.model")(sequelize, Sequelize);
db.loan.belongsTo(db.user, {
  foreignKey: 'user_id'
})

// emi table
db.emi = require("./loan/emi.model")(sequelize, Sequelize);
db.emi.belongsTo(db.loan, {
  foreignKey: 'loan_id'
})

// transaction table
db.transaction = require("./loan/transactions.model")(sequelize, Sequelize);
db.transaction.belongsTo(db.loan, {
  foreignKey: 'loan_id'
})

module.exports = db;
