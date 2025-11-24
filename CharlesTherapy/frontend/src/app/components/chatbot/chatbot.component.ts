import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { OpenAIService, ChatMessage } from '../../../services/openai.service';
import { SesionChatService } from '../../../services/sesion-chat.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  messages: {role: string, content: string, animatedContent?: string}[] = [
    {role: 'assistant', content: 'Hola, ¿en qué puedo ayudarte?'}
  ];
  userInput = '';
  loading = false;
  chatSesionId: number | null = null;
  chatSesionGuardada = true;
  sesionesHoy: any[] = [];
  usuario: any = {};
  private openaiService = inject(OpenAIService);

  constructor(private sesionChatService: SesionChatService) {}

  ngOnInit() {
    // Obtener datos de usuario del localStorage
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      try {
        this.usuario = JSON.parse(usuarioStr);
      } catch (e) {
        this.usuario = {};
      }
    }
    // Aquí deberías obtener el id_usuario real
    this.iniciarSesionChat(this.usuario?.id_usuario || 1); // Usa el id real si existe
    this.cargarSesionesDeHoy();
  }

  iniciarSesionChat(id_usuario: number) {
    this.messages = [
      {role: 'assistant', content: 'Hola, ¿en qué puedo ayudarte?'}
    ];
    this.sesionChatService.crearSesion({
      id_usuario,
      contenido: JSON.stringify(this.messages)
    }).subscribe({
      next: (resp) => {
        this.chatSesionId = resp.id_sesion;
        this.chatSesionGuardada = false;
      }
    });
  }

  guardarSesionChat() {
    if (this.chatSesionId != null) {
      this.sesionChatService.actualizarSesion(this.chatSesionId, JSON.stringify(this.messages)).subscribe({
        next: () => {
          this.chatSesionGuardada = true;
          alert('Sesión de chat guardada.');
        }
      });
    }
  }

  async cargarSesionesDeHoy() {
    // Suponiendo que el id_usuario está disponible
    const id_usuario = 1; // Reemplaza por el id real
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    const fechaHoy = `${yyyy}-${mm}-${dd}`;
    this.sesionChatService.obtenerSesionesPorUsuario(id_usuario).subscribe({
      next: (sesiones: any[]) => {
        this.sesionesHoy = sesiones.filter(s => s.fecha && s.fecha.startsWith(fechaHoy));
      }
    });
  }

  closeChat() {
    if (!this.chatSesionGuardada && confirm('¿Deseas guardar la sesión de chat antes de salir?')) {
      this.guardarSesionChat();
    }
    window.history.back();
    this.chatSesionId = null;
    this.chatSesionGuardada = true;
    this.cargarSesionesDeHoy();
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
      
      let botResponse = await this.openaiService.chat(enrichedMessages);
      botResponse = botResponse.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
      const animatedMsg = {role: 'assistant', content: botResponse, animatedContent: ''};
      this.messages.push(animatedMsg);
      await this.animateBotMessage(animatedMsg, botResponse);
      // Guardar sesión automáticamente después de cada mensaje
      if (this.chatSesionId != null) {
        this.sesionChatService.actualizarSesion(this.chatSesionId, JSON.stringify(this.messages)).subscribe();
      }
      this.chatSesionGuardada = false;
    } catch (error) {
      console.error('Error calling backend chat:', error);
      this.messages.push({role: 'assistant', content: 'Lo siento, hubo un error al contactar con el chatbot.'});
    } finally {
      this.loading = false;
    }
  }

  async animateBotMessage(msg: any, fullText: string) {
    const words = fullText.split(' ');
    msg.animatedContent = '';
    for (let i = 0; i < words.length; i++) {
      msg.animatedContent += (i > 0 ? ' ' : '') + words[i];
      await new Promise(res => setTimeout(res, 400));
    }
  }

  // Bloquear navegación por sidebar si hay sesión sin guardar
  canNavigate(): boolean {
    if (!this.chatSesionGuardada) {
      alert('Tienes una sesión de chat sin guardar. Por favor, guárdala o descártala antes de salir.');
      return false;
    }
    return true;
  }
}
