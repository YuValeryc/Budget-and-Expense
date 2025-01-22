const express = require('express');
const users = require('../controllers/userController'); 

const router = express.Router();

router.post('/register', users.register);
router.post('/login', users.login);
router.get('/financial-summary/:userId', users.summary_balance);
router.put('/updateUserInfo', users.updateUserInfo);
router.put('/updatePassword', users.updatePassword);

module.exports = router;
