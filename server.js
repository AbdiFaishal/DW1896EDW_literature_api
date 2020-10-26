const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const authRouter = require('./src/routes/authRoutes');
const profileRouter = require('./src/routes/profileRoutes');
const literatureRouter = require('./src/routes/literatureRoutes');
const collectionRouter = require('./src/routes/collectionRoutes');

app.use(express.json());
app.use(cors());

app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/api/v1', authRouter);
app.use('/api/v1', profileRouter);
app.use('/api/v1', literatureRouter);
app.use('/api/v1', collectionRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is runnning on port ${PORT}`);
});
