import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const AI_PROVIDER = process.env.AI_PROVIDER || 'openai';

// Configuración según el proveedor
const config = AI_PROVIDER === 'lmstudio' 
  ? {
      baseURL: process.env.LM_STUDIO_BASE_URL || 'http://localhost:1234/v1',
      apiKey: process.env.LM_STUDIO_API_KEY || 'lm-studio',
      model: process.env.LM_STUDIO_MODEL || 'local-model'
    }
  : {
      baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
      apiKey: process.env.OPENAI_API_KEY || '',
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
    };

const openai = new OpenAI({
  apiKey: config.apiKey,
  baseURL: config.baseURL,
});

console.log(`🤖 AI Service inicializado con proveedor: ${AI_PROVIDER}`);
console.log(`📍 Base URL: ${config.baseURL}`);
console.log(`🎯 Modelo: ${config.model}`);

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const aiService = {
  /**
   * Envía mensajes al modelo de IA configurado (OpenAI o LM Studio)
   */
  async chat(messages: ChatMessage[]): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: config.model,
        messages: messages,
      });
      return completion.choices[0].message?.content || '';
    } catch (error: any) {
      console.error('❌ Error en AI Service:', error.message);
      throw new Error(`Error al comunicarse con ${AI_PROVIDER}: ${error.message}`);
    }
  },

  /**
   * Obtiene recomendación de especialista basada en perfil Big Five
   */
  async obtenerRecomendacionEspecialista(bigFive: {
    neuroticismo: number;
    extraversion: number;
    apertura: number;
    amabilidad: number;
    responsabilidad: number;
  }): Promise<string> {
    const prompt = `Soy un sistema de apoyo psicométrico.\nEl paciente tiene los siguientes puntajes:\nNeuroticismo: ${bigFive.neuroticismo},\nExtraversion: ${bigFive.extraversion},\nApertura: ${bigFive.apertura},\nAmabilidad: ${bigFive.amabilidad},\nResponsabilidad: ${bigFive.responsabilidad}.\nBasado en estos resultados, ¿Qué tipo de especialista psicológico o de salud mental recomendarías para este perfil? Responde de forma breve y profesional.`;
    
    return this.chat([{ role: 'user', content: prompt }]);
  },

  /**
   * Obtiene el tipo de especialista más adecuado de una lista
   */
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
    const prompt = `Eres un sistema de recomendación psicométrica.\nEl paciente tiene los puntajes Big Five:\nNeuroticismo: ${bigFive.neuroticismo},\nExtraversion: ${bigFive.extraversion},\nApertura: ${bigFive.apertura},\nAmabilidad: ${bigFive.amabilidad},\nResponsabilidad: ${bigFive.responsabilidad}.\nDe acuerdo a estos resultados, responde únicamente con el tipo de especialista más adecuado de la siguiente lista (sin explicación, solo el nombre exacto de la especialidad):\n${especialidades.map(e => `- ${e}`).join('\n')}`;
    
    return this.chat([{ role: 'user', content: prompt }]);
  }
};
