import express from 'express';
import { getFriendListController } from '@controller/friendListController/getFriendListController.js';
const router = express.Router();

router.get('/list', getFriendListController);

export default router;
