import express from 'express';
var router = express.Router();
import User from '../controllers/User';
import Auth from '../middleware/Auth';

router.post('/register', User.register);
router.post('/login', User.login);
router.delete('/deleteUser', Auth.verifyAccountToken, User.delete);

export default router