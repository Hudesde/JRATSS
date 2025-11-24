import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CitasService {
    private apiUrl = `${environment.apiUrl}/citas`;

    constructor(private http: HttpClient) { }

    getCitas(): Observable<CitaModel[]> {
        return this.http.get<CitaModel[]>(`${this.apiUrl}/list`);
    }
    
    getCitaById(id: number): Observable<CitaModel> {
        return this.http.get<CitaModel>(`${this.apiUrl}/list/${id}`);
    }
    createCita(cita: CitaModel): Observable<CitaModel> {
        // Formatear la fecha a MySQL antes de enviar
        let new_cita :any= cita ;
        new_cita.fecha = this.formatFechaMySQL(cita.fecha);
        return this.http.post<CitaModel>(`${this.apiUrl}/create`, cita);
    }
    updateCita(id: number, cita: CitaModel): Observable<CitaModel> {
        // Formatear la fecha a MySQL antes de enviar
        let new_cita :any= cita ;
        new_cita.fecha = this.formatFechaMySQL(cita.fecha);
        return this.http.put<CitaModel>(`${this.apiUrl}/update/${id}`, cita);
    }
    deleteCita(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
    }
    getCitasByPacienteId(pacienteId: number): Observable<CitaModel[]> {
        return this.http.get<CitaModel[]>(`${this.apiUrl}/paciente/${pacienteId}`);
    }
    getCitasByEspecialistaId(especialistaId: number): Observable<CitaModel[]> {
        return this.http.get<CitaModel[]>(`${this.apiUrl}/especialista/${especialistaId}`);
    }

    getCitasPaciente(especialistaId: number): Observable<CitaModel[]> {
        return this.http.get<CitaModel[]>(`${this.apiUrl}/cita_paciente/${especialistaId}`);
    }

    formatFechaMySQL(date: Date): string {
        const pad = (n: number) => n < 10 ? '0' + n : n;
      
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1); // Mes comienza en 0
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
      
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }
      
}


export interface CitaModel {
    id_cita: number;
    paciente_id: number;
    paciente_nombre: string;
    especialista_id: number;
    fecha: Date;
    estado: string;
    descripcion: string
}
