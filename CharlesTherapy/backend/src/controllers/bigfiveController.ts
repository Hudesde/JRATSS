import { Request, Response } from 'express';
import pool from '../dataBase';

export const guardarBigFive = async (req: Request, res: Response) => {
  try {
    const {
      id_usuario,
      neuroticismo,
      extraversion,
      apertura,
      amabilidad,
      responsabilidad
    } = req.body;

    if (!id_usuario || neuroticismo == null || extraversion == null || apertura == null || amabilidad == null || responsabilidad == null) {
      return res.status(400).json({ error: 'Faltan datos requeridos para guardar el resultado del test.' });
    }

    const [result] = await pool.execute(
      `INSERT INTO bigfive 
        (id_usuario, neuroticismo, extraversion, apertura, amabilidad, responsabilidad, fecha_creacion)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [id_usuario, neuroticismo, extraversion, apertura, amabilidad, responsabilidad]
    );

    res.status(201).json({
      message: 'Resultado guardado correctamente',
      id_resultado: (result as any).insertId
    });
  } catch (error) {
    console.error('Error al guardar resultado:', error);
    res.status(500).json({ error: 'Error al guardar resultado del test' });
  }
};

export const obtenerBigFivePorUsuario = async (req: Request, res: Response) => {
  try {
    const { id_usuario } = req.params;
    if (!id_usuario) {
      return res.status(400).json({ error: 'Falta el id_usuario' });
    }
    const [rows] = await pool.execute(
      `SELECT * FROM bigfive WHERE id_usuario = ? ORDER BY fecha_creacion DESC`,
      [id_usuario]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener resultados:', error);
    res.status(500).json({ error: 'Error al obtener resultados del test' });
  }
};
