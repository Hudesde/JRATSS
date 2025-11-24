import { Request, Response } from 'express';
import { aiService, ChatMessage } from '../services/aiService';

/**
 * Endpoint para chat con IA (OpenAI o LM Studio según configuración)
 * POST /api/chat
 * Body: { messages: ChatMessage[] }
 */
export const chat = async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Se requiere un array de mensajes' });
    }

    const response = await aiService.chat(messages);
    res.json({ message: response });
  } catch (error: any) {
    console.error('Error en /api/chat:', error);
    res.status(500).json({ error: 'Error al procesar chat', detalle: error.message });
  }
};

/**
 * Obtener recomendación de especialista basada en Big Five
 * POST /api/chat/recomendacion-especialista
 * Body: { bigFive: { neuroticismo, extraversion, apertura, amabilidad, responsabilidad } }
 */
export const obtenerRecomendacionEspecialista = async (req: Request, res: Response) => {
  try {
    const { bigFive } = req.body;

    if (!bigFive || typeof bigFive !== 'object') {
      return res.status(400).json({ error: 'Se requiere objeto bigFive con puntajes' });
    }

    const response = await aiService.obtenerRecomendacionEspecialista(bigFive);
    res.json({ recomendacion: response });
  } catch (error: any) {
    console.error('Error en recomendación especialista:', error);
    res.status(500).json({ error: 'Error al obtener recomendación', detalle: error.message });
  }
};

/**
 * Obtener tipo de especialista de una lista
 * POST /api/chat/tipo-especialista
 * Body: { bigFive: {...}, especialidades: string[] }
 */
export const obtenerTipoEspecialista = async (req: Request, res: Response) => {
  try {
    const { bigFive, especialidades } = req.body;

    if (!bigFive || !especialidades || !Array.isArray(especialidades)) {
      return res.status(400).json({ error: 'Se requiere bigFive y array de especialidades' });
    }

    const response = await aiService.obtenerTipoEspecialista(bigFive, especialidades);
    res.json({ especialista: response });
  } catch (error: any) {
    console.error('Error en tipo especialista:', error);
    res.status(500).json({ error: 'Error al obtener tipo especialista', detalle: error.message });
  }
};
