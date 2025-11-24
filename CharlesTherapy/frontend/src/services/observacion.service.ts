import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root",
})
export class ObservacionService {
    private apiUrl = `${environment.apiUrl}/observaciones`;
    constructor(private http: HttpClient) {}

    getObservaciones() {
        return this.http.get(`${this.apiUrl}/list`);
    }
    getObservacionById(id: number) {
        return this.http.get(`${this.apiUrl}/list/${id}`);
    }
    createObservacion(observacion: any) {
        return this.http.post(`${this.apiUrl}/create`, observacion);
    }
    updateObservacion(id: number, observacion: any) {
        return this.http.put(`${this.apiUrl}/update/${id}`, observacion);
    }
    deleteObservacion(id: number) {
        return this.http.delete(`${this.apiUrl}/delete/${id}`);
    }
    getObservacionesByCitaId(citaId: number) {
        return this.http.get(`${this.apiUrl}/cita/${citaId}`);
    }
}