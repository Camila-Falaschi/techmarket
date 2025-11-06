const TransferService = require('../services/TransferService');
const TransactionModel = require('../models/TransactionModel');
const pool = require('../config/db');

class TransactionController {
  static async transfer(req, res) {
    try {
      const { fromAccountId, toAccountId, amount } = req.body;
      const result = await TransferService.transfer({ fromAccountId, toAccountId, amount });
      res.status(201).json(result);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  }

  static async statement(req, res) {
    try {
      const accountId = Number(req.params.accountId);
      const { startDate, endDate, limit } = req.query;
      const n = limit ? Number(limit) : 10;
      const txs = await TransactionModel.lastNByAccount(accountId, n, startDate, endDate);

      // também calcula o saldo chamando o procedure (opcional) ou via consulta simples:
      const [balanceRows] = await pool.query('SELECT balance FROM accounts WHERE id = ?', [accountId]);
      if (balanceRows.length === 0) return res.status(404).json({ error: 'Conta não encontrada' });
      const balance = Number(balanceRows[0].balance);

      res.json({ balance, transactions: txs });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = TransactionController;
