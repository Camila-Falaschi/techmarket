const AccountModel = require('../models/AccountModel');

class AccountController {
  static async create(req, res) {
    try {
      const { owner, initial_balance } = req.body;
      if (!owner) return res.status(400).json({ error: 'owner é obrigatório' });
      const account = await AccountModel.create({ owner, initial_balance });
      res.status(201).json(account);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const id = Number(req.params.id);
      const acc = await AccountModel.findById(id);
      if (!acc) return res.status(404).json({ error: 'Conta não encontrada' });
      res.json(acc);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = AccountController;
