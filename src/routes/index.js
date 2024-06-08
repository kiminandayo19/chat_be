import express from 'express';
import authRouter from '@routes/auth.js';

const router = express.Router();
const segment = '/rest/v1';

router.use(`${segment}/auth`, authRouter);

export default router;
