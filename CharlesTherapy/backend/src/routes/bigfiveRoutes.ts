import { Router } from 'express';
import { guardarBigFive, obtenerBigFivePorUsuario } from '../controllers/bigfiveController';

const router = Router();

router.post('/', guardarBigFive as any);
router.get('/:id_usuario', obtenerBigFivePorUsuario as any);

export default router;
