import express from 'express';
import reflectionsRouter from './Reflections';
import usersRouter from './Users';
import backupRouter from './Backup'

var router = express.Router();

router.use('/reflections', reflectionsRouter);
router.use('/users', usersRouter);
router.use('/backup', backupRouter);

export default router