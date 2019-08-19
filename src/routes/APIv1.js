import express from 'express';
import userRouter from './User';
import backupRouter from './Backup'
import communityRouter from './Community';

var router = express.Router();

router.use('/users', userRouter);
router.use('/backup', backupRouter);
router.use('/community', communityRouter)

export default router