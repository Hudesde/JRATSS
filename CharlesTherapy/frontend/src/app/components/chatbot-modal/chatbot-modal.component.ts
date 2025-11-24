import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OpenAIService, ChatMessage } from '../../../services/openai.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-chatbot-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot-modal.component.html',
  styleUrls: ['./chatbot-modal.component.css']
})
export class ChatbotModalComponent {
  @Input() show = false;
  @Input() messages: {role: string, content: string, animatedContent?: string}[] = [];
  @Input() userInput = '';
  @Input() loading = false;
  @Input() chatSesionGuardada: boolean = true;
  @Input() guardarSesionChat: () => void = () => {};

  private openaiService = inject(OpenAIService);
  usuario: any = {};

  constructor() {
    // Obtener datos de usuario del localStorage
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      try {
        this.usuario = JSON.parse(usuarioStr);
      } catch (e) {
        this.usuario = {};
      }
    }
  }

  async sendMessage() {
    if (!this.userInput.trim()) return;
    this.loading = true;
    const userMessage = this.userInput;
    this.messages.push({role: 'user', content: userMessage});
    this.userInput = '';
    try {
      // Enriquecer el prompt con datos del usuario y perfil psicométrico
      let perfil = '';
      if (this.usuario) {
        perfil += `Nombre completo: ${this.usuario.nombreCompleto || this.usuario.usuario || ''}. `;
        if (this.usuario.bigFive) {
          perfil += `Perfil psicométrico Big Five: `;
          if (this.usuario.bigFive.abierto) perfil += `Apertura: ${this.usuario.bigFive.abierto}. `;
          if (this.usuario.bigFive.responsable) perfil += `Responsabilidad: ${this.usuario.bigFive.responsable}. `;
          if (this.usuario.bigFive.extraverso) perfil += `Extraversión: ${this.usuario.bigFive.extraverso}. `;
          if (this.usuario.bigFive.amable) perfil += `Amabilidad: ${this.usuario.bigFive.amable}. `;
          if (this.usuario.bigFive.estable) perfil += `Estabilidad emocional: ${this.usuario.bigFive.estable}. `;
        }
      }
      const enrichedMessages: ChatMessage[] = [
        { role: 'system', content: `Eres un asistente servicial y amigable. Utiliza un tono empático y constructivo. Datos del usuario: ${perfil}` },
        ...this.messages.map(m => ({ role: m.role as any, content: m.content }))
      ];
      
      // Usar el servicio que llama al backend
      let botResponse = await this.openaiService.chat(enrichedMessages);
      botResponse = botResponse.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
      const animatedMsg = {role: 'assistant', content: botResponse, animatedContent: ''};
      this.messages.push(animatedMsg);
      await this.animateBotMessage(animatedMsg, botResponse);
    } catch (error) {
      console.error('Error calling backend chat:', error);
      this.messages.push({role: 'assistant', content: 'Lo siento, hubo un error al contactar con el chatbot.'});
    } finally {
      this.loading = false;
    }
  }

  closeChat = () => {
    this.show = false;
  };

  async animateBotMessage(msg: any, fullText: string) {
    const words = fullText.split(' ');
    msg.animatedContent = '';
    for (let i = 0; i < words.length; i++) {
      msg.animatedContent += (i > 0 ? ' ' : '') + words[i];
      await new Promise(res => setTimeout(res, 400));
    }
  }
}
