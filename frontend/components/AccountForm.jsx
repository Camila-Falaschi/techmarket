import React, { useState } from 'react';
import api from '../lib/api';
import { validateCPF, validateBirthDate, validatePhone } from '../utils/validation';

export default function AccountForm() {
  const [owner, setOwner] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [initialBalance, setInitialBalance] = useState(0);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function runValidations() {
    const e = {};
    if (!owner.trim()) e.owner = 'Nome do titular obrigatório';
    if (!validateCPF(cpf)) e.cpf = 'CPF inválido (precisa ter 11 dígitos e dígitos válidos)';
    if (!validateBirthDate(birthDate)) e.birthDate = 'Data de nascimento inválida';
    if (!validatePhone(phone)) e.phone = 'Telefone inválido (insira DDD + número, 10 ou 11 dígitos)';
    if (Number.isNaN(Number(initialBalance)) || Number(initialBalance) < 0) e.initialBalance = 'Saldo inicial inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setResult(null);
    if (!runValidations()) return;
    setLoading(true);
    try {
      const payload = {
        owner,
        initial_balance: Number(initialBalance)
      };
      const resp = await api.post('/accounts', payload);
      setResult({ success: true, data: resp.data });
    } catch (err) {
      setResult({ success: false, message: err.response?.data?.error || err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <label>Nome do titular
        <input value={owner} onChange={(e) => setOwner(e.target.value)} />
        {errors.owner && <small className="error">{errors.owner}</small>}
      </label>

      <label>CPF
        <input value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" />
        {errors.cpf && <small className="error">{errors.cpf}</small>}
      </label>

      <label>Data de nascimento
        <input value={birthDate} onChange={(e) => setBirthDate(e.target.value)} placeholder="YYYY-MM-DD ou DD/MM/YYYY" />
        {errors.birthDate && <small className="error">{errors.birthDate}</small>}
      </label>

      <label>Telefone
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(DDD) 9XXXX-XXXX" />
        {errors.phone && <small className="error">{errors.phone}</small>}
      </label>

      <label>Saldo inicial (R$)
        <input type="number" step="0.01" value={initialBalance} onChange={(e) => setInitialBalance(e.target.value)} />
        {errors.initialBalance && <small className="error">{errors.initialBalance}</small>}
      </label>

      <button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Abrir conta'}</button>

      {result && result.success && (
        <div className="result success">
          Conta criada! ID: {result.data.id} — Saldo: R$ {result.data.balance}
        </div>
      )}
      {result && !result.success && (
        <div className="result error">
          Erro: {result.message}
        </div>
      )}
    </form>
  );
}