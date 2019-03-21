import express from 'express';
var router = express.Router();
import Reflection from '../usingDB/controllers/Reflections';

router.post('/', Reflection.create);
router.get('/', Reflection.getAll);
router.get('/:id', Reflection.getOne);
router.put('/:id', Reflection.update);
router.delete('/:id', Reflection.delete);

export default router