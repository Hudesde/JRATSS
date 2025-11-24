import { Request, Response } from "express";
import pool from "../dataBase";

class ObservacionController {
    public async list(req: Request, res: Response): Promise<void> {
        try {
            const [resp] = await pool.query('SELECT * FROM observaciones');
            res.json(resp);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener las observaciones' });
        }
    }
    public async listOne(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const [resp]: any = await pool.query('SELECT * FROM observaciones WHERE id_observacion = ?', [id]);
            if (resp.length > 0) {
                res.json(resp[0]);
            } else {
                res.status(404).json({ message: 'Observación no encontrada' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener la observación' });
        }
    }
    public async create(req: Request, res: Response): Promise<void> {
        try {
            const { cita_id, observacion, fecha } = req.body;
            const query = `
                INSERT INTO observaciones (cita_id, observacion, fecha)
                VALUES (?, ?, ?)
            `;
            const [result] = await pool.query(query, [cita_id, observacion, fecha]);
            res.status(201).json({ message: 'Observación creada con éxito', insertId: (result as any).insertId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al crear la observación' });
        }
    }
    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { cita_id, observacion, fecha } = req.body;
        try {
            const [result]: any = await pool.query('UPDATE observaciones SET cita_id = ?, observacion = ?, fecha = ? WHERE id_observacion = ?', [cita_id, observacion, fecha, id]);
            if (result.affectedRows > 0) {
                res.json({ message: 'Observación actualizada' });
            } else {
                res.status(404).json({ message: 'Observación no encontrada' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al actualizar la observación' });
        }
    }
    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const [result]: any = await pool.query('DELETE FROM observaciones WHERE id_observacion = ?', [id]);
            if (result.affectedRows > 0) {
                res.json({ message: 'Observación eliminada' });
            } else {
                res.status(404).json({ message: 'Observación no encontrada' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al eliminar la observación' });
        }
    }
    getObservacionesByCita(req: Request, res: Response): Promise<void> {
        const { cita_id } = req.params;
        return pool.query('SELECT * FROM observaciones WHERE cita_id = ?', [cita_id])
            .then(([resp]: any) => {
                if (resp.length === 0) {
                    res.status(404).json({ message: 'No se encontraron observaciones para esta cita' });
                } else {
                    res.json(resp);
                }
            })
            .catch(error => {
                console.error(error);
                res.status(500).json({ message: 'Error al obtener las observaciones' });
            });
    }

}

export const observacionController = new ObservacionController();