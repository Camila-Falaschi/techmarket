const AccountModel = require('../models/AccountModel');

class AccountService {
  /**
   * Cria uma nova conta com validações de negócio
   */
  static async createAccount({ owner, cpf, email, birth_date, phone, initial_balance = 0 }) {
    // Validações de negócio
    this.validateAccountData({ owner, cpf, email, birth_date, phone, initial_balance });

    // Verifica duplicatas
    const existingCPF = await AccountModel.findByCPF(cpf);
    if (existingCPF) {
      throw new Error('CPF já cadastrado');
    }

    const existingEmail = await AccountModel.findByEmail(email);
    if (existingEmail) {
      throw new Error('E-mail já cadastrado');
    }

    // Valida saldo inicial
    const balance = Number(initial_balance);
    if (isNaN(balance) || balance < 0) {
      throw new Error('Saldo inicial deve ser maior ou igual a zero');
    }

    // Cria a conta
    const account = await AccountModel.create({
      owner: owner.trim(),
      cpf,
      email: email.trim().toLowerCase(),
      birth_date,
      phone,
      initial_balance: balance
    });

    return account;
  }

  /**
   * Busca conta por ID
   */
  static async getAccountById(id) {
    const account = await AccountModel.findById(id);
    if (!account) {
      throw new Error('Conta não encontrada');
    }
    return account;
  }

  /**
   * Validações de dados
   */
  static validateAccountData({ owner, cpf, email, birth_date, phone }) {
    if (!owner?.trim()) {
      throw new Error('Nome do titular é obrigatório');
    }

    if (!cpf || cpf.length !== 11) {
      throw new Error('CPF inválido (deve ter 11 dígitos)');
    }

    if (!this.isValidCPF(cpf)) {
      throw new Error('CPF inválido (dígitos verificadores incorretos)');
    }

    if (!email?.trim() || !this.isValidEmail(email)) {
      throw new Error('E-mail inválido');
    }

    if (!birth_date) {
      throw new Error('Data de nascimento é obrigatória');
    }

    if (!phone || (phone.length !== 10 && phone.length !== 11)) {
      throw new Error('Telefone inválido (10 ou 11 dígitos)');
    }
  }

  /**
   * Valida CPF (algoritmo de dígitos verificadores)
   */
  static isValidCPF(cpf) {
    // Rejeita sequências de dígitos iguais
    if (/^(\d)\1+$/.test(cpf)) return false;

    const calcCheck = (slice) => {
      let sum = 0;
      for (let i = 0; i < slice.length; i++) {
        sum += parseInt(slice[i], 10) * (slice.length + 1 - i);
      }
      const res = (sum * 10) % 11;
      return res === 10 ? 0 : res;
    };

    const dv1 = calcCheck(cpf.slice(0, 9));
    const dv2 = calcCheck(cpf.slice(0, 9) + dv1);

    return dv1 === parseInt(cpf[9], 10) && dv2 === parseInt(cpf[10], 10);
  }

  /**
   * Valida e-mail
   */
  static isValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }
}

module.exports = AccountService;