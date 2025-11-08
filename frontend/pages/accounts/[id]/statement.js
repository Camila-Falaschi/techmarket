import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../../lib/api';
import TransactionList from '../../../components/TransactionList';
import styles from '../../../styles/statement.module.scss';

export default function StatementPage() {
  const router = useRouter();
  const { id } = router.query;

  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatement = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const offsetLimit = limit; // API uses limit param; pagination here moves window by limit * (page-1)
      // Backend expects ?limit=10&startDate=...&endDate=...
      const params = { limit: offsetLimit };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const resp = await api.get(`/accounts/${id}/statement`, { params });
      setTransactions(resp.data.transactions || []);
      setBalance(resp.data.balance);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setTransactions([]);
      setBalance(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatement();
  }, [id, limit, page, startDate, endDate]);

  return (
    <main className={`${styles.container}`}>
      <header className={styles.header}>
        <h1>Extrato da conta {id}</h1>
        <div className={styles.controls}>
          <label>Limite
            <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </label>
          <label>Início
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>
          <label>Fim
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </label>
          <button onClick={fetchStatement}>Atualizar</button>
        </div>
      </header>

      <section className={styles.summary}>
        <div>Saldo atual: {balance === null ? '—' : `R$ ${balance}`}</div>
        {error && <div className={styles.error}>{error}</div>}
      </section>

      <section>
        {loading ? (
          <div className={styles.loading}>Carregando...</div>
        ) : (
          <TransactionList transactions={transactions} />
        )}
      </section>

      <footer className={styles.footer}>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} aria-label="Página anterior">Anterior</button>
        <span>Página {page}</span>
        <button onClick={() => setPage((p) => p + 1)} aria-label="Próxima página">Próxima</button>
      </footer>
    </main>
  );
}