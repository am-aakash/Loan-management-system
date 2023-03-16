const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//Auth Routes
const auth = require("./routes/auth.routes");
app.use("/auth", auth);

const loanRoute = require("./routes/loan.routes");
app.use("/api", loanRoute);

// home route
app.use("/", (req, res) => {
  res.send("Loan Management API working");
});

// db sequelize
const db = require("./models/index");
// db.sequelize.sync({
//   force: true,
// });

const CONFIG = require("./config/config");

// Server
const port = CONFIG.port;
app.listen(port, () => {
  console.log(`Listening on: http://localhost:${port}`);
});