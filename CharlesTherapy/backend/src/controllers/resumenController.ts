import { Request, Response } from 'express';
import * as resumenModel from '../model/resumenModel';

export const crearResumen = async (req: Request, res: Response) => {
  try {
    const { id_usuario, fecha, contenido, resumen } = req.body;
    if (!id_usuario || !fecha || !resumen) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }
    const result = await resumenModel.crearResumen({ id_usuario, fecha, contenido, resumen });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear resumen', error: (error as Error).message });
  }
};

export const obtenerResumenPorFecha = async (req: Request, res: Response) => {
  try {
    const { id_usuario, fecha } = req.query;
    if (!id_usuario || !fecha) {
      return res.status(400).json({ message: 'Faltan parámetros requeridos' });
    }
    const result = await resumenModel.obtenerResumenPorFecha(Number(id_usuario), String(fecha));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener resumen', error: (error as Error).message });
  }
};
