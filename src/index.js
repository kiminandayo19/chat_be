import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import routes from '@routes/index.js';
dotenv.config({
  path: '.env',
});

// eslint-disable-next-line no-undef
const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
