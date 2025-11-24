// Servicio centralizado para IA (OpenAI / LM Studio)
// Ahora toda la lógica de IA está en el backend

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { firstValueFrom } from 'rxjs';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

@Injectable({ providedIn: 'root' })
export class OpenAIService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Envía mensajes al chatbot (usa backend que decide entre OpenAI o LM Studio)
   */
  async chat(messages: ChatMessage[]): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ message: string }>(`${this.apiUrl}/chat`, { messages })
      );
      return response.message;
    } catch (error: any) {
      console.error('Error calling backend chat:', error);
      throw new Error('Error al comunicarse con el chatbot');
    }
  }

  async obtenerRecomendacionEspecialista(bigFive: {
    neuroticismo: number;
    extraversion: number;
    apertura: number;
    amabilidad: number;
    responsabilidad: number;
  }): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ recomendacion: string }>(
          `${this.apiUrl}/chat/recomendacion-especialista`,
          { bigFive }
        )
      );
      return response.recomendacion;
    } catch (error: any) {
      console.error('Error obtaining recommendation:', error);
      throw new Error('Error al obtener recomendación');
    }
  }

  async obtenerTipoEspecialista(
    bigFive: {
      neuroticismo: number;
      extraversion: number;
      apertura: number;
      amabilidad: number;
      responsabilidad: number;
    },
    especialidades: string[]
  ): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ especialista: string }>(
          `${this.apiUrl}/chat/tipo-especialista`,
          { bigFive, especialidades }
        )
      );
      return response.especialista;
    } catch (error: any) {
      console.error('Error obtaining specialist type:', error);
      throw new Error('Error al obtener tipo de especialista');
    }
  }
}
