import express from 'express';
var router = express.Router();
import Reflection from '../usingDB/controllers/Reflections';
import Auth from '../usingDB/middleware/Auth';

router.post('/', Auth.verifyToken, Reflection.create);
router.get('/', Auth.verifyToken, Reflection.getAll);
router.get('/:id', Auth.verifyToken, Reflection.getOne);
router.put('/:id', Auth.verifyToken, Reflection.update);
router.delete('/:id', Auth.verifyToken, Reflection.delete);

export default router