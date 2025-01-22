const express = require('express');
const expense = require('../controllers/expenseController');

const router = express.Router();

router.post('/show', expense.showExpenses);
router.post('/add', expense.addExpense);
router.delete('/delete/:id', expense.deleteExpense);

module.exports = router;