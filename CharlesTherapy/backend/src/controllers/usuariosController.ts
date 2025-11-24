import { Request, Response } from 'express';
import pool from '../dataBase'; // Importa la conexión desde dataBase.ts

class UsuariosController {
  // Obtener todos los usuarios
  async getUsuarios(req: Request, res: Response): Promise<void> {
    try {
      const [rows] = await pool.query('SELECT * FROM usuarios');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuarios', error });
    }
  }

  // Obtener un usuario por ID
  async getUsuarioById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
      if ((rows as any[]).length === 0) {
        res.status(404).json({ message: 'Usuario no encontrado' });
      } else {
        res.json((rows as any[])[0]);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el usuario', error });
    }
  }

  // Crear un nuevo usuario
  async createUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { usuario, correo, password, rol, cedula, especialidad } = req.body;
      const result = await pool.query(
        'INSERT INTO usuarios (usuario, correo, password, rol, cedula, especialidad) VALUES (?, ?, ?, ?, ?, ?)',
        [usuario, correo, password, rol, cedula, especialidad]
      );
      res.status(201).json({ id: (result[0] as any).insertId, usuario, correo, rol, cedula, especialidad });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear usuario', detalle: error });
    }
  }

  // Actualizar un usuario por ID
  async updateUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { usuario, correo, password, cedula, bigFive, especialidad } = req.body;
      const result = await pool.query(
        'UPDATE usuarios SET usuario = ?, correo = ?, password = ?, cedula = ?, bigFive = ?, especialidad = ? WHERE id_usuario = ?',
        [usuario, correo, password, cedula, bigFive, especialidad, id]
      );
      if ((result[0] as any).affectedRows === 0) {
        res.status(404).json({ message: 'Usuario no encontrado' });
      } else {
        res.json({ id, usuario, correo, cedula, bigFive, especialidad });
      }
    } catch (error) {
      res.status (500).json({ error: 'Error al actualizar usuario' });
    }
  }

  // Eliminar un usuario por ID
  async deleteUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
      if ((result[0] as any).affectedRows === 0) {
        res.status(404).json({ message: 'Usuario no encontrado' });
      } else {
        res.json({ message: 'Usuario eliminado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el usuario', error });
    }
  }

  // Login de usuario
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { correo, password } = req.body;
      const [rows] = await pool.query(
        'SELECT * FROM usuarios WHERE correo = ? AND password = ?',
        [correo, password]
      );
      if ((rows as any[]).length === 0) {
        res.status(401).json({ message: 'Correo o contraseña incorrectos' });
      } else {
        // Puedes retornar solo los datos necesarios, no toda la fila
        res.json({ message: 'Login exitoso', usuario: (rows as any[])[0] });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al iniciar sesión', error });
    }
  }

  // Obtener usuarios por rol
  async getUsuariosByRol(req: Request, res: Response): Promise<void> {
    try {
      const { rol } = req.params;
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE rol = ?', [rol]);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuarios por rol', error });
    }
  }

  // Obtener usuarios por especialidad
  async getUsuariosByEspecialidad(req: Request, res: Response): Promise<void> {
    try {
      const { especialidad } = req.params;
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE especialidad = ?', [especialidad]);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuarios por especialidad', error });
    }
  }
}

export const usuariosController = new UsuariosController();
