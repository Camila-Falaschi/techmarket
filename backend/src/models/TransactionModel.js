const pool = require('../config/db');

class TransactionModel {
  static async create({ code, from_account_id, to_account_id, amount }, connection) {
    const conn = connection || pool;
    const [result] = await conn.query(
      `INSERT INTO transactions (code, from_account_id, to_account_id, amount, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [code, from_account_id, to_account_id, amount]
    );
    const insertId = result.insertId;
    const [rows] = await pool.query('SELECT * FROM transactions WHERE id = ?', [insertId]);
    return rows[0];
  }

  static async lastNByAccount(accountId, n = 10, startDate = null, endDate = null) {
    let sql = `
      SELECT * FROM transactions
      WHERE (from_account_id = ? OR to_account_id = ?)
    `;
    const params = [accountId, accountId];

    if (startDate) {
      sql += ' AND created_at >= ?';
      params.push(startDate);
    }
    if (endDate) {
      sql += ' AND created_at <= ?';
      params.push(endDate);
    }

    sql += ' ORDER BY created_at DESC LIMIT ?';
    params.push(n);

    const [rows] = await pool.query(sql, params);
    return rows;
  }
}

module.exports = TransactionModel;
