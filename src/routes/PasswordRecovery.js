import express from 'express';
import PasswordRecovery from '../controllers/PasswordRecovery';
import PRMiddlware from '../middleware/PasswordRecovery';
import Auth from '../middleware/Auth';

var router = express.Router();
router.get(
  '/getVCode',
  Auth.verifyAppToken,
  PRMiddlware.checkEmailExists,
  PasswordRecovery.getVCode
);

export default router;
