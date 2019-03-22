import express from 'express';
var router = express.Router();
import Users from '../controllers/Users';
import Auth from '../middleware/Auth';

router.post('/register', Users.register);
router.post('/login', Users.login);
router.delete('/deleteUser', Auth.verifyToken, Users.delete);

export default router