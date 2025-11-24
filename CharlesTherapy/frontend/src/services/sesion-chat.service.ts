import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface SesionChat {
  id_sesion?: number;
  id_usuario: number;
  contenido: string; // JSON.stringify de los mensajes
  fecha_creacion?: string;
}

@Injectable({ providedIn: 'root' })
export class SesionChatService {
  private apiUrl = `${environment.apiUrl}/sesiones`;

  constructor(private http: HttpClient) {}

  crearSesion(sesion: SesionChat): Observable<any> {
    return this.http.post(this.apiUrl, sesion);
  }

  actualizarSesion(id_sesion: number, contenido: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id_sesion}`, { contenido });
  }

  obtenerSesionesPorUsuario(id_usuario: number) {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${id_usuario}`);
  }

  obtenerSesionPorId(id_sesion: number): Observable<SesionChat> {
    return this.http.get<SesionChat>(`${this.apiUrl}/${id_sesion}`);
  }

  /**
   * Obtiene las sesiones de un usuario en una fecha específica (por defecto, hoy)
   * @param id_usuario
   * @param fecha (opcional, formato YYYY-MM-DD)
   */
  obtenerSesionesPorUsuarioYFecha(id_usuario: number, fecha?: string) {
    let url = `${this.apiUrl}/sesiones/usuario/${id_usuario}/fecha`;
    if (fecha) {
      url += `?fecha=${fecha}`;
    }
    return this.http.get<any[]>(url);
  }
}
