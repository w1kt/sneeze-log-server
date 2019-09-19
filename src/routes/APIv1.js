import express from 'express';
import userRouter from './User';
import backupRouter from './Backup'
import communityRouter from './Community';
import passwordRecoveryRouter from './PasswordRecovery'

var router = express.Router();

router.use('/users', userRouter);
router.use('/backup', backupRouter);
router.use('/community', communityRouter);
router.use('/passwordRecovery', passwordRecoveryRouter);

export default router