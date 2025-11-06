const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Account = require('./account')(sequelize);
const Transaction = require('./transaction')(sequelize);

Account.hasMany(Transaction, { foreignKey: 'accountId' });
Transaction.belongsTo(Account, { foreignKey: 'accountId' });

module.exports = {
  sequelize,
  Account,
  Transaction
};
