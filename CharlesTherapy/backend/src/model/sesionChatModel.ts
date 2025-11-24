export interface SesionChat {
  id_sesion?: number;
  id_usuario: number;
  contenido: string; // JSON.stringify de los mensajes
  fecha_creacion?: string;
}

// Si usas funciones de modelo, exporta aquí la función para obtener sesiones por usuario
// export async function getSesionesPorUsuario(id_usuario: number) { ... }
