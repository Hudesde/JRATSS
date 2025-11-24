module.exports = {
  execute: async () => [{ insertId: 123 }],
  crearSesion: async () => ({ id_sesion: 1 }),
  obtenerSesionesPorUsuarioYFecha: async () => [{ id: 1, mensajes: 'Hola' }]
};
