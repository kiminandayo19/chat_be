import express from 'express';
import cors from 'cors';
import routes from '@routes/index.js';
import configs from '@utils/config.js';
import { verifyAuth, verifyHeaders } from '@middlewares/headersMiddleware.js';

const port = configs.port || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(verifyHeaders);
app.use(verifyAuth);
app.use(routes);

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
