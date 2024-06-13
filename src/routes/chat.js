import express from 'express';
import { createRoomController, getChatListController } from '@controller/index.js';

const router = express.Router();

router.post('/create', createRoomController);
router.get('/list', getChatListController);

export default router;
