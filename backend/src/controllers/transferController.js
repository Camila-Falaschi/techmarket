const { Account, Transaction, sequelize } = require('../models');
const { v4: uuidv4 } = require('uuid');

async function makeTransfer(req, res) {
  const { fromAccountId, toAccountId, amount } = req.body;
  const value = parseFloat(amount);

  if (!fromAccountId || !toAccountId || isNaN(value) || value <= 0) {
    return res.status(400).json({ error: 'Parâmetros inválidos' });
  }
  if (fromAccountId === toAccountId) {
    return res.status(400).json({ error: 'Conta de origem e destino não podem ser iguais' });
  }

  // transação atômica
  const t = await sequelize.transaction();
  try {
    const fromAcc = await Account.findByPk(fromAccountId, { transaction: t, lock: true });
    const toAcc = await Account.findByPk(toAccountId, { transaction: t, lock: true });

    if (!fromAcc || !toAcc) {
      await t.rollback();
      return res.status(404).json({ error: 'Conta não encontrada' });
    }

    const saldo = parseFloat(fromAcc.balance);

    if (saldo < value) {
      await t.rollback();
      return res.status(400).json({ error: 'Saldo insuficiente' });
    }

    // debitar e creditar
    fromAcc.balance = (saldo - value).toFixed(2);
    toAcc.balance = (parseFloat(toAcc.balance) + value).toFixed(2);

    await fromAcc.save({ transaction: t });
    await toAcc.save({ transaction: t });

    const code = uuidv4();

    await Transaction.create({
      code,
      type: 'DEBIT',
      amount: value,
      description: `Transfer to account ${toAcc.id}`,
      accountId: fromAcc.id
    }, { transaction: t });

    await Transaction.create({
      code,
      type: 'CREDIT',
      amount: value,
      description: `Transfer from account ${fromAcc.id}`,
      accountId: toAcc.id
    }, { transaction: t });

    await t.commit();
    return res.json({ success: true, code, fromAccount: fromAcc, toAccount: toAcc });
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({ error: 'Erro ao processar transferência' });
  }
}

module.exports = { makeTransfer };
