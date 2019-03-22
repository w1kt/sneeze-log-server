import express from 'express';
import Auth from '../middleware/Auth';
import Backup from '../controllers/Backup';

var router = express.Router();

router.post('/push', Auth.verifyToken, Backup.push);
router.get('/pull', Auth.verifyToken, Backup.pull);

export default router;