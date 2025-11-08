import React from 'react';
import styles from '../styles/statement.module.scss';

function formatCurrency(val) {
  return Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function TransactionList({ transactions = [] }) {
  if (!transactions.length) return <div className={styles.empty}>Nenhuma transação encontrada.</div>;

  return (
    <div className={styles.transactions}>
      {transactions.map((t) => {
        const amount = Number(t.amount);
        const highlight = amount > 5000;
        const date = new Date(t.created_at).toLocaleString('pt-BR');
        return (
          <article key={t.id} className={`${styles.transaction} ${highlight ? styles.highlight : ''}`}>
            <div className={styles.row}>
              <div className={styles.meta}>
                <div className={styles.code}>{t.code}</div>
                <div className={styles.date}>{date}</div>
              </div>
              <div className={styles.amount}>{formatCurrency(amount)}</div>
            </div>
            <div className={styles.accounts}>
              <span>De: {t.from_account_id}</span>
              <span>Para: {t.to_account_id}</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}