const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Transaction = sequelize.define('Transaction', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, allowNull: false, unique: true }, // UUID
    type: { type: DataTypes.ENUM('DEBIT','CREDIT'), allowNull: false },
    amount: { type: DataTypes.DECIMAL(15,2), allowNull: false },
    description: { type: DataTypes.STRING },
    accountId: { type: DataTypes.INTEGER, allowNull: false }
  }, { tableName: 'transactions', timestamps: true });

  return Transaction;
};
