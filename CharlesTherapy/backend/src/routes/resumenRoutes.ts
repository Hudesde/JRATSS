import { Router } from 'express';
import * as resumenController from '../controllers/resumenController';

const router = Router();

router.post('/', (req, res) => { resumenController.crearResumen(req, res); });
router.get('/', (req, res) => { resumenController.obtenerResumenPorFecha(req, res); });

export default router;