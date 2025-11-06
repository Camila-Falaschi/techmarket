const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Account = sequelize.define('Account', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ownerName: { type: DataTypes.STRING, allowNull: false },
    cpf: { type: DataTypes.STRING(11), allowNull: false, unique: true },
    balance: { type: DataTypes.DECIMAL(15,2), allowNull: false, defaultValue: 0.00 }
  }, { tableName: 'accounts', timestamps: true });

  return Account;
};
