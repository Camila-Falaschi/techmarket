const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');

router.post('/', transferController.makeTransfer);

// opcional: rota GET para formulário
router.get('/form', (req, res) => res.render('transfer_form'));

module.exports = router;
