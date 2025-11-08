import React, { useState } from 'react';
import api from '../lib/api';
import { 
  validateCPF, 
  validateBirthDate, 
  validatePhone, 
  validateEmail,
  maskCPF,
  maskPhone,
  maskDate,
  maskMoney,
  onlyDigits
} from '../utils/validation';

export default function AccountForm() {
  const [owner, setOwner] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [initialBalance, setInitialBalance] = useState('0.00');
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function runValidations() {
    const e = {};
    if (!owner.trim()) e.owner = 'Nome do titular obrigatório';
    if (!validateCPF(cpf)) e.cpf = 'CPF inválido (precisa ter 11 dígitos e dígitos válidos)';
    if (!validateEmail(email)) e.email = 'E-mail inválido';
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
        cpf: onlyDigits(cpf),
        email: email.trim(),
        birth_date: birthDate.includes('/') 
          ? birthDate.split('/').reverse().join('-') // DD/MM/YYYY -> YYYY-MM-DD
          : birthDate,
        phone: onlyDigits(phone),
        initial_balance: Number(initialBalance)
      };
      const resp = await api.post('/accounts', payload);
      setResult({ success: true, data: resp.data });
      
      // Limpa o formulário após sucesso
      setOwner('');
      setCpf('');
      setEmail('');
      setBirthDate('');
      setPhone('');
      setInitialBalance('0.00');
    } catch (err) {
      setResult({ success: false, message: err.response?.data?.error || err.message });
    } finally {
      setLoading(false);
    }
  }

  function handleCPFChange(e) {
    const masked = maskCPF(e.target.value);
    if (onlyDigits(masked).length <= 11) {
      setCpf(masked);
    }
  }

  function handlePhoneChange(e) {
    const masked = maskPhone(e.target.value);
    if (onlyDigits(masked).length <= 11) {
      setPhone(masked);
    }
  }

  function handleDateChange(e) {
    const masked = maskDate(e.target.value);
    if (onlyDigits(masked).length <= 8) {
      setBirthDate(masked);
    }
  }

  function handleBalanceChange(e) {
    const value = e.target.value.replace(/[^\d.,]/g, '').replace(',', '.');
    setInitialBalance(value);
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <label>Nome do titular
        <input 
          value={owner} 
          onChange={(e) => setOwner(e.target.value)} 
          maxLength={255}
        />
        {errors.owner && <small className="error">{errors.owner}</small>}
      </label>

      <label>CPF
        <input 
          value={cpf} 
          onChange={handleCPFChange} 
          placeholder="000.000.000-00"
          maxLength={14}
        />
        {errors.cpf && <small className="error">{errors.cpf}</small>}
      </label>

      <label>E-mail
        <input 
          type="email"
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="seu@email.com"
          maxLength={255}
        />
        {errors.email && <small className="error">{errors.email}</small>}
      </label>

      <label>Data de nascimento
        <input 
          value={birthDate} 
          onChange={handleDateChange} 
          placeholder="DD/MM/AAAA"
          maxLength={10}
        />
        {errors.birthDate && <small className="error">{errors.birthDate}</small>}
      </label>

      <label>Telefone
        <input 
          value={phone} 
          onChange={handlePhoneChange} 
          placeholder="(00) 90000-0000"
          maxLength={15}
        />
        {errors.phone && <small className="error">{errors.phone}</small>}
      </label>

      <label>Saldo inicial (R$)
        <input 
          type="text"
          value={initialBalance} 
          onChange={handleBalanceChange}
          placeholder="0.00"
        />
        {errors.initialBalance && <small className="error">{errors.initialBalance}</small>}
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Enviando...' : 'Abrir conta'}
      </button>

      {result && result.success && (
        <div className="result success">
          Conta criada! ID: {result.data.id} — Saldo: R$ {maskMoney(result.data.balance)}
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