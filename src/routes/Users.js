import express from 'express';
var router = express.Router();
import Users from '../usingDB/controllers/Users';
import Auth from '../usingDB/middleware/Auth';

router.post('/', Users.create);
router.post('/login', Users.login);
router.delete('/deleteUser', Auth.verifyToken, Users.delete);

export default router