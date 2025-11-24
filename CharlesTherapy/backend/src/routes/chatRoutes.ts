import { Router } from 'express';
import { chat, obtenerRecomendacionEspecialista, obtenerTipoEspecialista } from '../controllers/chatController';

const router = Router();

// Endpoint principal de chat
router.post('/', chat);

// Endpoints específicos para recomendaciones
router.post('/recomendacion-especialista', obtenerRecomendacionEspecialista);
router.post('/tipo-especialista', obtenerTipoEspecialista);

export default router;
