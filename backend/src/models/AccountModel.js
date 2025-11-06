// Model para contas
const pool = require('../config/db');

class AccountModel {
  static async create({ owner, initial_balance = 0 }) {
    const [result] = await pool.query(
      'INSERT INTO accounts (owner, balance) VALUES (?, ?)',
      [owner, initial_balance]
    );
    const insertId = result.insertId;
    const [rows] = await pool.query('SELECT * FROM accounts WHERE id = ?', [insertId]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM accounts WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async updateBalance(id, newBalance, connection = null) {
    const conn = connection || pool;
    await conn.query('UPDATE accounts SET balance = ? WHERE id = ?', [newBalance, id]);
  }

  static async adjustBalance(id, delta, connection) {
    // usa SELECT ... FOR UPDATE dentro de transação para consistência
    const [rows] = await connection.query('SELECT balance FROM accounts WHERE id = ? FOR UPDATE', [id]);
    if (rows.length === 0) throw new Error('Conta não encontrada');
    const current = Number(rows[0].balance);
    const updated = Number((current + Number(delta)).toFixed(2));
    await connection.query('UPDATE accounts SET balance = ? WHERE id = ?', [updated, id]);
    return updated;
  }
}

module.exports = AccountModel;
