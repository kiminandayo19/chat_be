import express from 'express';
import { decryptController, encryptController } from '@controller/index.js';

const router = express.Router();

router.post('/encrypt', encryptController);
router.post('/decrypt', decryptController);

export default router;
