const pool = require('../config/db');
const AccountModel = require('../models/AccountModel');
const TransactionModel = require('../models/TransactionModel');
const { v4: uuidv4 } = require('uuid');

class TransferService {
  // realiza transferência atômica entre contas
  static async transfer({ fromAccountId, toAccountId, amount }) {
    if (!fromAccountId || !toAccountId) throw new Error('IDs das contas são obrigatórios');
    if (fromAccountId === toAccountId) throw new Error('Conta de origem e destino devem ser diferentes');
    amount = Number(amount);
    if (!(amount > 0)) throw new Error('Valor deve ser maior que zero');

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // bloqueia linha da conta de origem e verifica saldo
      const [fromRows] = await connection.query('SELECT balance FROM accounts WHERE id = ? FOR UPDATE', [fromAccountId]);
      if (fromRows.length === 0) throw new Error('Conta de origem não encontrada');
      const fromBalance = Number(fromRows[0].balance);

      if (fromBalance < amount) throw new Error('Saldo insuficiente');

      // bloqueia conta destino
      const [toRows] = await connection.query('SELECT balance FROM accounts WHERE id = ? FOR UPDATE', [toAccountId]);
      if (toRows.length === 0) throw new Error('Conta destino não encontrada');

      // atualiza saldos
      const newFromBalance = Number((fromBalance - amount).toFixed(2));
      const newToBalance = Number((Number(toRows[0].balance) + amount).toFixed(2));

      await connection.query('UPDATE accounts SET balance = ? WHERE id = ?', [newFromBalance, fromAccountId]);
      await connection.query('UPDATE accounts SET balance = ? WHERE id = ?', [newToBalance, toAccountId]);

      // registra transação com código único
      const code = uuidv4();
      const [res] = await connection.query(
        `INSERT INTO transactions (code, from_account_id, to_account_id, amount, created_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [code, fromAccountId, toAccountId, amount]
      );

      await connection.commit();

      // retorna a operação
      return {
        code,
        transactionId: res.insertId,
        fromAccountId,
        toAccountId,
        amount,
        fromBalance: newFromBalance,
        toBalance: newToBalance
      };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
}

module.exports = TransferService;
