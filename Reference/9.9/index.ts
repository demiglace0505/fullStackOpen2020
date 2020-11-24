import express from 'express';
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  console.log('somone pinged')
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON ${PORT}`);
});