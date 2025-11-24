import { Component, inject, OnInit } from '@angular/core';
import { ChatbotModalComponent } from '../chatbot-modal/chatbot-modal.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { OpenAIService, ChatMessage } from '../../../services/openai.service';
import { SesionChatService } from '../../../services/sesion-chat.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, ChatbotModalComponent, SidebarComponent],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {
  showChatModal = false;
  messages: {role: string, content: string, animatedContent?: string}[] = [
    {role: 'assistant', content: 'Hola, ¿en qué puedo ayudarte con tu historial?'}
  ];
  userInput = '';
  loading = false;

  // Simulación de historial de sesiones (puedes reemplazar por datos reales)
  sesiones = [
    { fecha: '2024-05-01', descripcion: 'Me sentí mejor después de la charla.' },
    { fecha: '2024-05-08', descripcion: 'Hablamos sobre mis metas personales.' },
    { fecha: '2024-05-15', descripcion: 'Identifiqué nuevos retos.' }
  ];

  // Contactos ficticios para la barra lateral
  contactos = [
    { nombre: 'Ana Martínez', inicial: 'A', foto: '' },
    { nombre: 'Carlos López', inicial: 'C', foto: '' },
    { nombre: 'Beatriz Gómez', inicial: 'B', foto: '' },
    { nombre: 'David Torres', inicial: 'D', foto: '' },
    { nombre: 'Elena Ruiz', inicial: 'E', foto: '' }
  ];

  chatSesionId: number | null = null;
  chatSesionGuardada = true;

  private openaiService = inject(OpenAIService);

  constructor(private sesionChatService: SesionChatService) {}

  ngOnInit() {
    // Aquí puedes cargar el historial de sesiones del usuario si es necesario
  }

  iniciarSesionChat(id_usuario: number) {
    this.messages = [
      {role: 'assistant', content: 'Hola, ¿en qué puedo ayudarte con tu historial?'}
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

  closeChat() {
    if (!this.chatSesionGuardada && confirm('¿Deseas guardar la sesión de chat antes de salir?')) {
      this.guardarSesionChat();
    }
    this.showChatModal = false;
    this.chatSesionId = null;
    this.chatSesionGuardada = true;
    this.messages = [
      {role: 'assistant', content: 'Hola, ¿en qué puedo ayudarte con tu historial?'}
    ];
    this.userInput = '';
  }

  openChat() {
    // Aquí deberías obtener el id_usuario real
    this.iniciarSesionChat(1); // Reemplaza 1 por el id real
    this.showChatModal = true;
  }

  sendMessage = async () => {
    if (!this.userInput.trim()) return;
    this.loading = true;
    const userMessage = this.userInput;
    this.messages.push({role: 'user', content: userMessage});
    this.userInput = '';
    try {
      const chatMessages: ChatMessage[] = this.messages.map(m => ({
        role: m.role as any,
        content: m.content
      }));
      
      let botResponse = await this.openaiService.chat(chatMessages);
      botResponse = botResponse.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
      const animatedMsg = {role: 'assistant', content: botResponse, animatedContent: ''};
      this.messages.push(animatedMsg);
      await this.animateBotMessage(animatedMsg, botResponse);
    } catch (error) {
      console.error('Error calling backend chat:', error);
      this.messages.push({role: 'assistant', content: 'Lo siento, hubo un error al contactar con el chatbot.'});
    } finally {
      this.loading = false;
      this.chatSesionGuardada = false;
    }
  };

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
    if (!this.chatSesionGuardada && this.showChatModal) {
      alert('Tienes una sesión de chat sin guardar. Por favor, guárdala o descártala antes de salir.');
      return false;
    }
    return true;
  }
}
