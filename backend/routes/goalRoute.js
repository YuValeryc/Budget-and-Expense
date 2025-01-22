const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');

router.get('/show', goalController.getGoals);

router.post('/add', goalController.addGoal);

router.patch('/update/:id', goalController.updateGoal);

router.delete('/delete/:id', goalController.deleteGoal);

module.exports = router;
