const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const routes = require('./routes/routes');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', routes);

// health
app.get('/health', (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
