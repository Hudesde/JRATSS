import { Router } from 'express';
import { usuariosController } from '../controllers/usuariosController';

const router = Router();

// Rutas para usuarios
router.post('/login', usuariosController.login);
router.get('/', usuariosController.getUsuarios);
router.get('/:id', usuariosController.getUsuarioById);
router.post('/', usuariosController.createUsuario);
router.put('/:id', usuariosController.updateUsuario);
router.delete('/:id', usuariosController.deleteUsuario);
router.get('/rol/:rol', usuariosController.getUsuariosByRol);
router.get('/especialidad/:especialidad', usuariosController.getUsuariosByEspecialidad);
export default router;
