const express = require('express');
const income = require('../controllers/incomeController');

const router = express.Router();

router.post('/show', income.showIncomes);
router.post('/add', income.addIncome);
router.delete('/delete/:id', income.deleteIncome);

module.exports = router;