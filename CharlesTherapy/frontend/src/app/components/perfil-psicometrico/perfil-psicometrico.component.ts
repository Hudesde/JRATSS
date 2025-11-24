import { Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatbotModalComponent } from '../chatbot-modal/chatbot-modal.component';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { SesionChatService } from '../../../services/sesion-chat.service';
import { BigFiveService } from '../../../services/bigfive.service';
import { BigFiveResult } from '../../models/bigfive.model';
import { OpenAIService } from '../../../services/openai.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-perfil-psicometrico',
  standalone: true,
  imports: [CommonModule, ChatbotModalComponent, SidebarComponent],
  templateUrl: './perfil-psicometrico.component.html',
  styleUrls: ['./perfil-psicometrico.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})


export class PerfilPsicometricoComponent implements OnInit {
  paciente = {
    nombre: 'Juan Pérez',
    email: 'juan.perez@example.com',
    id_usuario: 0
  };

  bigFiveTraits = [
    { key: 'neuroticismo', label: 'Neuroticismo' },
    { key: 'extraversion', label: 'Extraversión' },
    { key: 'apertura', label: 'Apertura' },
    { key: 'amabilidad', label: 'Amabilidad' },
    { key: 'responsabilidad', label: 'Responsabilidad' }
  ];
  // Resultados del Big Five
  constructor(
    private bigFiveService: BigFiveService,
    private sesionChatService: SesionChatService,
    private openaiService: OpenAIService,
    private http: HttpClient
  ) { }

  bigFiveResult: any = null;

  ngOnInit() {
    const usuarioStr = localStorage.getItem('usuario');
    const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;

    if (!usuario || !usuario.id_usuario) {
      console.error('Usuario no encontrado en localStorage');
      return;
    }

    // 🔄 Asigna datos al paciente desde el localStorage
    this.paciente.nombre = usuario.usuario || 'Desconocido';
    this.paciente.email = usuario.correo || '---';
    this.paciente.id_usuario = usuario.id_usuario;
    //console.log('Datos del paciente:', this.paciente);
    // 🔄 Obtiene el ID del usuario

    const id_usuario = Number(usuario.id_usuario);

    this.bigFiveService.getResultsByUser(id_usuario).subscribe({
      next: (resultados: BigFiveResult[]) => {
        if (resultados.length > 0) {
          const r = resultados[resultados.length - 1];
          this.bigFiveResult = {
            neuroticismo: Number(r.neuroticismo),
            extraversion: Number(r.extraversion),
            apertura: Number(r.apertura),
            amabilidad: Number(r.amabilidad),
            responsabilidad: Number(r.responsabilidad)
          };
        }
      },
      error: (err: any) => {
        console.error('Error al obtener resultados Big Five:', err);
      }
    });
  }


  getTraitValue(traitKey: string): number {
    const val = (this.bigFiveResult as any)?.[traitKey];
    return typeof val === 'number' && !isNaN(val) ? val : 0;
  }

  getWidth(valor: number, max: number = 5): number {
    return Math.round((valor / max) * 100);
  }

  getColor(valor: number): string {
    if (valor < 1.6) return 'bajo';         // Verde
    if (valor < 3.3) return 'medio';        // Amarillo
    return 'alto';                          // Rojo
  }

  // --- OpenAI ---
  recomendacion: string = '';
  loading: boolean = false;

  // Nueva variable para el tipo de especialista recomendado
  tipoEspecialistaRecomendado: string = '';
  loadingTipoEspecialista: boolean = false;

  async obtenerRecomendacion() {
    this.loading = true;
    this.recomendacion = 'Obteniendo recomendación...';

    try {
      this.recomendacion = await this.openaiService.obtenerRecomendacionEspecialista(this.bigFiveResult);
    } catch (error) {
      this.recomendacion = 'Ocurrió un error al obtener la recomendación.';
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  // Nueva función para obtener solo el tipo de especialista recomendado
  async obtenerTipoEspecialistaRecomendado() {
    this.loadingTipoEspecialista = true;
    this.tipoEspecialistaRecomendado = 'Obteniendo tipo de especialista...';

    // Lista de especialidades válidas
    const especialidades = [
      "Psicólogo clínico",
      "Psicólogo educativo",
      "Psicólogo organizacional o laboral",
      "Psicólogo forense",
      "Psicólogo de la salud",
      "Psicólogo deportivo",
      "Psicólogo neuropsicólogo",
      "Psicólogo social",
      "Psicólogo infantil o del desarrollo",
      "Psicólogo cognitivo-conductual",
      "Psicoterapeuta",
      "Psicólogo comunitario",
      "Psicólogo experimental",
      "Psicólogo gerontológico"
    ];

    try {
      this.tipoEspecialistaRecomendado = await this.openaiService.obtenerTipoEspecialista(this.bigFiveResult, especialidades);
    } catch (error) {
      this.tipoEspecialistaRecomendado = '';
      console.error(error);
    } finally {
      this.loadingTipoEspecialista = false;
    }
  }

  especialistas: any[] = [];
  loadingEspecialistas: boolean = false;

  obtenerEspecialistasPorEspecialidad(especialidad: string) {
    this.loadingEspecialistas = true;
    this.especialistas = [];
    this.http.get<any[]>(`http://localhost:3000/api/usuarios/especialidad/${encodeURIComponent(especialidad)}`)
      .subscribe({
        next: (data) => {
          this.especialistas = data;
        },
        error: (err) => {
          this.especialistas = [];
          console.error('Error al obtener especialistas:', err);
        },
        complete: () => {
          this.loadingEspecialistas = false;
        }
      });
  }

  // --- Chatbot modal ---
  showChatModal = false;
  messages: { role: string, content: string, animatedContent?: string }[] = [
    { role: 'assistant', content: 'Hola, ¿en qué puedo ayudarte con tu perfil psicométrico?' }
  ];
  userInput = '';
  loadingChat = false;
  chatSesionId: number | null = null;
  chatSesionGuardada = true;

  iniciarSesionChat(id_usuario: number) {
    this.messages = [
      {role: 'assistant', content: 'Hola, ¿en qué puedo ayudarte con tu perfil psicométrico?'}
    ];
    this.chatSesionId = null;
    this.chatSesionGuardada = false;
    this.sesionChatService.crearSesion({
      id_usuario,
      contenido: JSON.stringify(this.messages)
    }).subscribe({
      next: (resp: any) => {
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
      {role: 'assistant', content: 'Hola, ¿en qué puedo ayudarte con tu perfil psicométrico?'}
    ];
    this.userInput = '';
  }

  openChat(id_usuario: number) {
    this.iniciarSesionChat(id_usuario);
    this.showChatModal = true;
  }

  async sendMessage() {
    if (!this.userInput.trim()) return;
    this.loadingChat = true;
    const userMessage = this.userInput;
    this.messages.push({ role: 'user', content: userMessage });
    this.userInput = '';
    setTimeout(() => {
      const botResponse = 'Esta es una respuesta simulada para el perfil psicométrico.';
      const animatedMsg = { role: 'assistant', content: botResponse, animatedContent: '' };
      this.messages.push(animatedMsg);
      this.animateBotMessage(animatedMsg, botResponse);
      this.loadingChat = false;
      this.chatSesionGuardada = false;
    }, 1000);
  }

  async animateBotMessage(msg: any, fullText: string) {
    const words = fullText.split(' ');
    msg.animatedContent = '';
    for (let i = 0; i < words.length; i++) {
      msg.animatedContent += (i > 0 ? ' ' : '') + words[i];
      await new Promise(res => setTimeout(res, 400));
    }
  }
}
