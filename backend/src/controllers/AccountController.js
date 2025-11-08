const AccountService = require('../services/AccountService');

class AccountController {
  static async create(req, res) {
    try {
      const { owner, cpf, email, birth_date, phone, initial_balance } = req.body;

      const account = await AccountService.createAccount({
        owner,
        cpf,
        email,
        birth_date,
        phone,
        initial_balance
      });

      res.status(201).json(account);
    } catch (err) {
      console.error(err);

      // Erros de validação (400)
      if (err.message.includes('obrigatório') ||
        err.message.includes('inválido') ||
        err.message.includes('deve ter') ||
        err.message.includes('deve ser')) {
        return res.status(400).json({ error: err.message });
      }

      // Erros de duplicata (409)
      if (err.message.includes('já cadastrado')) {
        return res.status(409).json({ error: err.message });
      }

      // Erros do MySQL
      if (err.code === 'ER_DUP_ENTRY') {
        if (err.message.includes('cpf')) {
          return res.status(409).json({ error: 'CPF já cadastrado' });
        }
        if (err.message.includes('email')) {
          return res.status(409).json({ error: 'E-mail já cadastrado' });
        }
      }

      // Erro genérico (500)
      res.status(500).json({ error: 'Erro ao criar conta' });
    }
  }

  static async getById(req, res) {
    try {
      const id = Number(req.params.id);
      const account = await AccountService.getAccountById(id);
      res.json(account);
    } catch (err) {
      console.error(err);

      if (err.message === 'Conta não encontrada') {
        return res.status(404).json({ error: err.message });
      }

      res.status(500).json({ error: 'Erro ao buscar conta' });
    }
  }
}

module.exports = AccountController;