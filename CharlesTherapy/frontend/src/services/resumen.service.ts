import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ResumenService {
  constructor(private http: HttpClient) {}

  crearResumen(data: { id_usuario: number, fecha: string, contenido: string, resumen: string }) {
    return this.http.post('/api/resumen', data);
  }

  obtenerResumenPorFecha(id_usuario: number, fecha: string) {
    return this.http.get('/api/resumen', { params: { id_usuario, fecha } });
  }
}
