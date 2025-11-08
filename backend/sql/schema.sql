-- Criação do banco (ajuste se já existir)
CREATE DATABASE IF NOT EXISTS techmarket CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE techmarket;

-- Tabela de contas
CREATE TABLE IF NOT EXISTS accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner VARCHAR(255) NOT NULL,
  cpf VARCHAR(11) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  birth_date DATE NOT NULL,
  phone VARCHAR(11) NOT NULL,
  balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_cpf (cpf),
  INDEX idx_email (email)
) ENGINE=InnoDB;

-- Tabela de transações
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  from_account_id INT NULL,
  to_account_id INT NULL,
  amount DECIMAL(15,2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_account_id) REFERENCES accounts(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (to_account_id) REFERENCES accounts(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_from_account (from_account_id),
  INDEX idx_to_account (to_account_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- Stored procedure que retorna saldo e últimas 10 transações (duas SELECTs)
DROP PROCEDURE IF EXISTS sp_get_balance_and_transactions;
DELIMITER $$
CREATE PROCEDURE sp_get_balance_and_transactions(
  IN p_account_id INT,
  IN p_start DATETIME,
  IN p_end DATETIME
)
BEGIN
  -- Saldo atual
  SELECT balance FROM accounts WHERE id = p_account_id;

  -- Últimas 10 transações dentro do período (se informado)
  IF p_start IS NULL AND p_end IS NULL THEN
    SELECT * FROM transactions
    WHERE (from_account_id = p_account_id OR to_account_id = p_account_id)
    ORDER BY created_at DESC
    LIMIT 10;
  ELSEIF p_end IS NULL THEN
    SELECT * FROM transactions
    WHERE (from_account_id = p_account_id OR to_account_id = p_account_id)
      AND created_at >= p_start
    ORDER BY created_at DESC
    LIMIT 10;
  ELSEIF p_start IS NULL THEN
    SELECT * FROM transactions
    WHERE (from_account_id = p_account_id OR to_account_id = p_account_id)
      AND created_at <= p_end
    ORDER BY created_at DESC
    LIMIT 10;
  ELSE
    SELECT * FROM transactions
    WHERE (from_account_id = p_account_id OR to_account_id = p_account_id)
      AND created_at BETWEEN p_start AND p_end
    ORDER BY created_at DESC
    LIMIT 10;
  END IF;
END$$
DELIMITER ;
