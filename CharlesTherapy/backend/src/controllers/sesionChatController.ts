import { Request, Response } from 'express';
import pool from '../dataBase';

// Crear nueva sesión de chat
export const crearSesion = async (req: Request, res: Response) => {
  try {
    const { id_usuario, contenido } = req.body;
    if (!id_usuario || !contenido) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }
    const [result] = await pool.execute(
      'INSERT INTO sesiones (id_usuario, contenido) VALUES (?, ?)',
      [id_usuario, contenido]
    );
    res.status(201).json({ message: 'Sesión creada', id_sesion: (result as any).insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear sesión', detalle: error });
  }
};

// Actualizar contenido de una sesión existente
export const actualizarSesion = async (req: Request, res: Response) => {
  try {
    const { id_sesion } = req.params;
    const { contenido } = req.body;
    if (!id_sesion || !contenido) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }
    await pool.execute(
      'UPDATE sesiones SET contenido = ? WHERE id_sesion = ?',
      [contenido, id_sesion]
    );
    res.json({ message: 'Sesión actualizada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar sesión', detalle: error });
  }
};

// Obtener sesiones de un usuario
export const obtenerSesionesPorUsuario = async (req: Request, res: Response) => {
  try {
    const { id_usuario } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM sesiones WHERE id_usuario = ? ORDER BY fecha_creacion DESC',
      [id_usuario]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener sesiones', detalle: error });
  }
};

// Obtener una sesión por id
export const obtenerSesionPorId = async (req: Request, res: Response) => {
  try {
    const { id_sesion } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM sesiones WHERE id_sesion = ?',
      [id_sesion]
    );
    if ((rows as any[]).length === 0) {
      res.status(404).json({ error: 'Sesión no encontrada' });
    } else {
      res.json((rows as any[])[0]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener sesión', detalle: error });
  }
};
// Obtener sesiones de un usuario en una fecha específica (por defecto, el día actual)
export const obtenerSesionesPorUsuarioYFecha = async (req: Request, res: Response) => {
  try {
    const { id_usuario } = req.params;
    const { fecha } = req.query;

    if (!id_usuario || isNaN(Number(id_usuario))) {
      return res.status(400).json({ error: 'Falta o es inválido el id_usuario' });
    }

    // Si no se proporciona fecha, usar la fecha actual en formato YYYY-MM-DD
    let fechaConsulta: string;
    if (fecha && typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      fechaConsulta = fecha;
    } else {
      fechaConsulta = new Date().toISOString().split('T')[0];
    }

    const [rows] = await pool.execute(
      `SELECT * FROM sesiones 
       WHERE id_usuario = ? 
       AND DATE(fecha_creacion) = ? 
       ORDER BY fecha_creacion DESC`,
      [id_usuario, fechaConsulta]
    );

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener sesiones por fecha', detalle: (error as Error).message });
  }
};