const express = require('express');
const AccountController = require('../controllers/AccountController');
const TransactionController = require('../controllers/TransactionController');

const router = express.Router();

// Accounts
router.post('/accounts', AccountController.create);
router.get('/accounts/:id', AccountController.getById);

// Transfers
router.post('/transfers', TransactionController.transfer);

// Extrato / statement
router.get('/accounts/:accountId/statement', TransactionController.statement);

module.exports = router;
