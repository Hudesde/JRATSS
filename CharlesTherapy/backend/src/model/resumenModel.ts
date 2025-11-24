import dataBase from '../dataBase';

interface CrearResumenParams {
  id_usuario: number;
  fecha: string;
  contenido: string;
  resumen: string;
}

export async function crearResumen({ id_usuario, fecha, contenido, resumen }: CrearResumenParams) {
  const [result]: any = await dataBase.query(
    'INSERT INTO resumen (id_usuario, fecha, contenido, resumen) VALUES (?, ?, ?, ?)',
    [id_usuario, fecha, contenido, resumen]
  );
  return { id_resumen: result.insertId };
}

export async function obtenerResumenPorFecha(id_usuario: number, fecha: string) {
  const [rows]: any = await dataBase.query(
    'SELECT * FROM resumen WHERE id_usuario = ? AND fecha = ?',
    [id_usuario, fecha]
  );
  return rows[0];
}
