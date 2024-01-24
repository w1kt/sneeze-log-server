import express from 'express';
import userRouter from './User';
import backupRouter from './Backup'
import communityRouter from './Community';
import passwordRecoveryRouter from './PasswordRecovery'
import levelRouter from './Level';
import syncRouter from './Sync';

var router = express.Router();

router.use('/users', userRouter);
router.use('/backup', backupRouter);
// community router is deprecated and replaced by /sync, remove once enough upgrade client
router.use('/community', communityRouter);
router.use('/passwordRecovery', passwordRecoveryRouter);
router.use('/level', levelRouter);
router.use('/sync', syncRouter);

export default router