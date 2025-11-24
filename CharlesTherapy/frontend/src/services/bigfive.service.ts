import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BigFiveResult } from '../models/bigfive.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class BigFiveService {
  private apiUrl = `${environment.apiUrl}/bigfive`;

  constructor(private http: HttpClient) {}

  saveResult(result: BigFiveResult): Observable<any> {
    return this.http.post(this.apiUrl, result);
  }

  getResultsByUser(id_usuario: number): Observable<BigFiveResult[]> {
    return this.http.get<BigFiveResult[]>(`${this.apiUrl}/${id_usuario}`);
  }
}
