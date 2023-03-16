const fs = require('fs');
const csv = require('csv-parser');
const {parse} = require('csv-parse');
const fetch = require('node-fetch');

// Define the path to the CSV file
const filePath = './data/data.csv';
let transactionList;

// Define a function to read the CSV file and return an array of objects
async function getTransactions() {
  const results = [];
  const stream = fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      console.log('CSV file successfully processed');
      return results;
    });
  return new Promise((resolve) => {
    stream.on('end', () => {
      resolve(results);
    });
  });
}

// Call the function to get the transactions array
getTransactions().then((transactions) => {
  transactionList = transactions;
  console.log(transactionList);
});

getCreditScore = (aadhar_id) => {
  const userTransactions = transactionList.filter(transaction => transaction.user === aadhar_id);
  
  // calculate total account balance
  let accountBalance = 0;
  userTransactions.forEach(transaction => {
    if (transaction.transaction_type === 'CREDIT') {
      accountBalance += transaction.amount;
    } else if (transaction.transaction_type === 'DEBIT') {
      accountBalance -= transaction.amount;
    }
  });
  
  // calculate credit score
  let creditScore;
  if (accountBalance >= 1000000) {
    creditScore = 900;
  } else if (accountBalance <= 100000) {
    creditScore = 300;
  } else {
    const balanceDifference = accountBalance - 100000;
    const creditScoreChange = Math.floor(balanceDifference / 15000) * 10;
    creditScore = 300 + creditScoreChange;
  }
  
  return creditScore;
};

module.exports = getCreditScore;