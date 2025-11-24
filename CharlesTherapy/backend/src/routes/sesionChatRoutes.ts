import { Router, Request, Response } from 'express';
import { crearSesion, actualizarSesion, obtenerSesionesPorUsuario, obtenerSesionPorId, obtenerSesionesPorUsuarioYFecha } from '../controllers/sesionChatController';

const router = Router();

// Crear nueva sesión
router.post('/', (req: Request, res: Response) => { crearSesion(req, res); });
// Actualizar contenido de sesión
router.put('/:id_sesion', (req: Request, res: Response) => { actualizarSesion(req, res); });
// Obtener todas las sesiones de un usuario
router.get('/usuario/:id_usuario', (req: Request, res: Response) => { obtenerSesionesPorUsuario(req, res); });
// Obtener una sesión por id
router.get('/:id_sesion', (req: Request, res: Response) => { obtenerSesionPorId(req, res); });
// Obtener sesiones de un usuario por fecha (SOLO UN DÍA)
router.get('/sesiones/usuario/:id_usuario/fecha', (req: Request, res: Response) => { obtenerSesionesPorUsuarioYFecha(req, res); });

export default router;
