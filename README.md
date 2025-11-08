# 🛒 TechMarket – Projeto Integrado Interdisciplinar (ADS)
Este projeto foi desenvolvido como parte do Projeto Integrado Interdisciplinar do curso de Análise e Desenvolvimento de Sistemas, com o objetivo de aplicar de forma prática os conhecimentos adquiridos ao longo do semestre.

O trabalho tem como base o estudo de caso da empresa fictícia TechMarket, especializada em e-commerce, que enfrenta desafios de desempenho, escalabilidade, usabilidade e confiabilidade durante períodos de alta demanda, como promoções e datas especiais.

# 🏗️ Tecnologias Utilizadas
- Node.js / Express.js – Backend e criação de endpoints
- HTML / CSS / JavaScript – Desenvolvimento do frontend
- MySQL – Banco de dados relacional e procedures
- Visual Paradigm – Modelagem e diagramas
- VS Code – Ambiente de desenvolvimento
- Trello – Organização das sprints (metodologia Scrum)

# 📁 Estrutura de Pastas
```
techmarket/
│
├── backend/              # Código do servidor e endpoints REST
│  └── sql/               # Scripts SQL e procedures
└── frontend/             # Páginas web e formulários
```

# 🧾 Endpoints da API

> POST /api/accounts

body:
```
{
  "owner": "João Silva",
  "initial_balance": 1000
}
```
response:
```
{
  "id": 1,
  "owner": "João Silva",
  "balance": 1000,
  "created_at": "2025-11-06T22:00:00.000Z"
}
```
</br>

> GET /api/accounts/:id

parametro:
```
/api/accounts/1
```
response:
```
{
  "id": 1,
  "owner": "João Silva",
  "balance": 1000,
  "created_at": "2025-11-06T22:00:00.000Z"
}

ou

{
  "error": "Conta não encontrada"
}
```
</br>

> POST /api/transfers

body:
```
{
  "fromAccountId": 1,
  "toAccountId": 2,
  "amount": 150.50
}
```
response:
```
{
  "code": "b5a42d2f-8c15-4e2a-8b02-8c9df4e6828b",
  "transactionId": 3,
  "fromAccountId": 1,
  "toAccountId": 2,
  "amount": 150.5,
  "fromBalance": 849.5,
  "toBalance": 150.5
}

ou

{
  "error": "Saldo insuficiente"
}
```
</br>

> GET /api/accounts/:accountId/statement

parametro:
```
/api/accounts/1/statement?limit=10&startDate=2025-10-01&endDate=2025-11-01
```
response:
```
{
  "balance": 849.5,
  "transactions": [
    {
      "id": 3,
      "code": "b5a42d2f-8c15-4e2a-8b02-8c9df4e6828b",
      "from_account_id": 1,
      "to_account_id": 2,
      "amount": 150.5,
      "created_at": "2025-11-06T22:01:00.000Z"
    }
  ]
}

ou

{
  "error": "Conta não encontrada"
}
```
