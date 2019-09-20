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
router.get(
  '/verifyVCode',
  Auth.verifyAppToken,
  PRMiddlware.checkEmailExists,
  PRMiddlware.verifyVCode,
  (req, res) => res.status(200).send({ message: 'Verification code is valid' })
);
router.post(
  '/changePassword',
  Auth.verifyAppToken,
  PRMiddlware.checkEmailExists,
  PRMiddlware.verifyVCode,
  PasswordRecovery.changePassword
);

export default router;
