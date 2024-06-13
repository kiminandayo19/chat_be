import express from 'express';
import authRouter from '@routes/auth.js';
import friendListRouter from '@routes/friendList.js';
import chatRouter from '@routes/chat.js';

const router = express.Router();
const segment = '/rest/v1';

router.use(`${segment}/auth`, authRouter);
router.use(`${segment}/friendship`, friendListRouter);
router.use(`${segment}/chat`, chatRouter);

export default router;
