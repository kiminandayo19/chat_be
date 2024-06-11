import express from 'express';
import authRouter from '@routes/auth.js';
import friendListRouter from '@routes/friendList.js';

const router = express.Router();
const segment = '/rest/v1';

router.use(`${segment}/auth`, authRouter);
router.use(`${segment}/friendship`, friendListRouter);

export default router;
