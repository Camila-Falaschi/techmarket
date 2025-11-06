const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
require('dotenv').config();

const transferRoutes = require('./routes/transferRoutes');
const extratoRoutes = require('./routes/extratoRoutes');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

app.use('/api/transfer', transferRoutes);
app.use('/extrato', extratoRoutes);

// sincronizar modelos (somente em dev; em prod use migrations)
(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB conectado');
    await sequelize.sync({ alter: true }); // em dev
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Servido na porta ${port}`));
  } catch (err) {
    console.error('Erro DB:', err);
  }
})();
