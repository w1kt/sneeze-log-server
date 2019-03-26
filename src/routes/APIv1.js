import express from 'express';
import reflectionsRouter from './Reflections';
import userRouter from './User';
import backupRouter from './Backup'

var router = express.Router();

router.use('/reflections', reflectionsRouter);
router.use('/users', userRouter);
router.use('/backup', backupRouter);

export default router