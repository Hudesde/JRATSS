import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ChatbotModalComponent } from '../chatbot-modal/chatbot-modal.component';
import { Router } from '@angular/router';
import { SesionChatService } from '../../../services/sesion-chat.service';
import { ResumenService } from '../../../services/resumen.service';
import { OpenAIService, ChatMessage } from '../../../services/openai.service';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, ChatbotModalComponent],
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  // Datos de ejemplo para el mini perfil
  usuario: any = {};

  // Estado del resumen semanal
  tieneResumenSemanal = false; // Cambia a true para simular que hay resumen

  // Estado de la cita en turno (null si no hay cita)
  citaEnTurno: { fecha: string, hora: string, motivo: string } | null = null; // Cambia a un objeto para simular cita

  showChatModal = false;
  messages: {role: string, content: string, animatedContent?: string}[] = [
    {role: 'assistant', content: 'Hola, como puedo ayudarte (?)'}
  ];
  userInput = '';
  loading = false;

  // Lógica de sesión de chat
  chatSesionId: number | null = null;
  chatSesionGuardada = true;

  // Estado del resumen diario
  resumenDiario: string | null = null;
  generandoResumen = false;

  // Estado para mostrar/ocultar el resumen
  mostrarResumen: boolean = false;

  // Estado para mostrar el modal del test Big Five
  showBigFiveModal: boolean = false;

  constructor(
    private router: Router,
    private sesionChatService: SesionChatService,
    private resumenService: ResumenService,
    private openaiService: OpenAIService
  ) {
    // Prevenir navegación si hay sesión de chat sin guardar SOLO en navegador
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', (event: BeforeUnloadEvent) => {
        if (!this.chatSesionGuardada && this.showChatModal) {
          event.preventDefault();
          event.returnValue = '';
        }
      });
    }
  }

  ngOnInit() {
    // Solo acceder a localStorage si está disponible
    let usuarioStr = '';
    if (typeof window !== 'undefined' && window.localStorage) {
      usuarioStr = window.localStorage.getItem('usuario') || '';
    }
    if (!usuarioStr) {
      console.warn('No hay datos de usuario en el localStorage');
      return;
    }
    try {
      this.usuario = JSON.parse(usuarioStr);
      console.log('Usuario cargado:', this.usuario);

      // Mostrar modal si no ha completado el test Big Five
      this.showBigFiveModal = !this.usuario.bigFive;

    } catch (error) {
      console.error('Error al parsear datos del usuario:', error);
    }
  }


  // Iniciar sesión solo en memoria
  iniciarSesionChat() {
    this.messages = [
      {role: 'assistant', content: 'Hola, como puedo ayudarte (?)'}
    ];
    this.chatSesionId = null;
    this.chatSesionGuardada = false;
  }

  // Guardar sesión al cerrar
  guardarSesionChat() {
    if (!this.usuario?.id_usuario) return;
    this.sesionChatService.crearSesion({
      id_usuario: this.usuario.id_usuario,
      contenido: JSON.stringify(this.messages)
    }).subscribe({
      next: (resp) => {
        this.chatSesionId = resp.id_sesion;
        this.chatSesionGuardada = true;
        alert('Sesión de chat guardada.');
      }
    });
  }

  closeChat() {
    if (!this.chatSesionGuardada && confirm('¿Deseas guardar la sesión de chat antes de salir?')) {
      this.guardarSesionChat();
    }
    this.showChatModal = false;
    this.chatSesionId = null;
    this.chatSesionGuardada = true;
    this.messages = [
      {role: 'assistant', content: 'Hola, como puedo ayudarte (?)'}
    ];
    this.userInput = '';
  }

  // Bloquear navegación por sidebar si hay sesión sin guardar
  canNavigate(): boolean {
    if (!this.chatSesionGuardada && this.showChatModal) {
      alert('Tienes una sesión de chat sin guardar. Por favor, guárdala o descártala antes de salir.');
      return false;
    }
    return true;
  }

  // Llama a esto al abrir el modal
  openChat() {
    this.iniciarSesionChat();
    this.showChatModal = true;
  }

  // Llama a esto cada vez que se envía un mensaje
  async sendMessage() {
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
      this.chatSesionGuardada = false;
    } catch (error) {
      console.error('Error calling backend chat:', error);
      this.messages.push({role: 'assistant', content: 'Lo siento, hubo un error al contactar con el chatbot.'});
    } finally {
      this.loading = false;
    }
  }

  async animateBotMessage(msg: any, fullText: string) {
    // Animar palabra por palabra
    const words = fullText.split(' ');
    msg.animatedContent = '';
    for (let i = 0; i < words.length; i++) {
      msg.animatedContent += (i > 0 ? ' ' : '') + words[i];
      await new Promise(res => setTimeout(res, 400));
    }
  }

  abrirModalCita() {
    // Aquí se implementará la lógica para abrir el modal de agendar cita
    alert('Abrir modal para agendar cita (por implementar)');
  }

  abrirBigFiveModal() {
    this.showBigFiveModal = true;
  }

  onBigFiveCompleted() {
    // Actualizar el usuario y ocultar el modal
    this.usuario.bigFive = true;
    localStorage.setItem('usuario', JSON.stringify(this.usuario));
    this.showBigFiveModal = false;
    // (Opcional) Aquí podrías llamar a un servicio para actualizar el usuario en backend si lo deseas
  }

  irAPerfilPsicometrico() {
    this.router.navigate(['/perfilPsicometrico']); // Corrige la ruta a la que navega el botón
  }

  irABigFiveTest() {
    this.router.navigate(['/bigfive']); // Corrige la ruta a la que navega el botón
  }

  irACitas() {
    this.router.navigate(['/citas/paciente/']);
  }

  async generarDailyResume() {
    if (!this.usuario?.id_usuario) return;
    const id_usuario = this.usuario.id_usuario;
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    const fechaHoy = `${yyyy}-${mm}-${dd}`;
    this.generandoResumen = true;
    this.sesionChatService.obtenerSesionesPorUsuarioYFecha(id_usuario, fechaHoy).subscribe({
      next: async (sesiones: any[]) => {
        // Filtrar solo los mensajes del usuario
        let mensajesUsuario: string[] = [];
        sesiones.forEach(s => {
          try {
            const mensajes = JSON.parse(s.contenido);
            if (Array.isArray(mensajes)) {
              mensajesUsuario.push(...mensajes.filter((m: any) => m.role === 'user').map((m: any) => m.content));
            }
          } catch (e) {
            // Si no es JSON válido, ignora
          }
        });
        const contenido = mensajesUsuario.join('\n');
        if (!contenido) {
          alert('No hay mensajes del usuario para resumir hoy.');
          this.generandoResumen = false;
          return;
        }
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
        const prompt = `Eres un asistente servicial y amigable. Elabora un resumen de no más de 400 palabras de los siguientes mensajes del usuario (ignora las respuestas del chatbot). Utiliza un tono empático y constructivo, y si es posible, ofrece sugerencias o palabras de ánimo.\n\nDatos del usuario: ${perfil}\n\nMensajes del usuario hoy:\n${contenido}`;
        let resumen = '';
        try {
          resumen = await this.openaiService.chat([{ role: 'user', content: prompt }]);
          this.resumenDiario = resumen;
          this.tieneResumenSemanal = true;
          this.generandoResumen = false;
          // Guardar en la tabla resumen
          this.resumenService.crearResumen({
            id_usuario,
            fecha: fechaHoy,
            contenido,
            resumen
          }).subscribe({
            next: () => {},
            error: () => {
              alert('El resumen se generó pero no se pudo guardar en la base de datos.');
            }
          });
        } catch (error) {
          alert('Error al generar el resumen con IA.');
          this.generandoResumen = false;
          return;
        }
      },
      error: () => {
        alert('Error al obtener las sesiones de chat.');
        this.generandoResumen = false;
      }
    });
  }

  toggleResumen() {
    this.mostrarResumen = !this.mostrarResumen;
  }
}