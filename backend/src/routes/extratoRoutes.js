const express = require('express');
const router = express.Router();
const { Account, Transaction } = require('../models');

router.get('/:accountId', async (req, res) => {
  const accountId = req.params.accountId;
  const account = await Account.findByPk(accountId);
  if (!account) return res.status(404).send('Conta não encontrada');

  // pegar últimas 100 transações apenas para exibição (ou realizar consulta paginada)
  const transacoes = await Transaction.findAll({
    where: { accountId },
    order: [['createdAt', 'DESC']],
    limit: 100
  });

  res.render('extrato', { account, transacoes });
});

module.exports = router;
