import express from 'express';
import Auth from '../middleware/Auth';
import Backup from '../controllers/Backup';

var router = express.Router();

router.post('/push', Auth.verifyAccountToken, Backup.push);
router.get('/pull', Auth.verifyAccountToken, Backup.pull);

export default router;