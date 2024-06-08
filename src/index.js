import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import authRouter from '@routes/auth.js';
dotenv.config({
  path: '.env',
});

// eslint-disable-next-line no-undef
const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());

app.use('/rest/v1/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
