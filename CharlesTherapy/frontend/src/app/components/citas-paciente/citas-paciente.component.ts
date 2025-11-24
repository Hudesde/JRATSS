import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CitaModel, CitasService } from '../../../services/cita.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';

// Importaciones de FullCalendar
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { Router } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-citas-paciente',
   standalone: true,
  imports: [FormsModule, CommonModule, FullCalendarModule, SidebarComponent, HttpClientModule],
  templateUrl: './citas-paciente.component.html',
  styleUrl: './citas-paciente.component.css'
})
export class CitasPacienteComponent {
 //Variables
  paciente_id = 4;
  cita_predefinida = {
    fecha: new Date(),
    paciente_id: 0,
    paciente_nombre: '',
    especialista_id: this.paciente_id,
    estado: 'en confirmacion',
    id_cita: 0,
    descripcion: 'Nueva solicitud de paciente'
  };
  cita: CitaModel = this.cita_predefinida
  new_cita: CitaModel = this.cita_predefinida

  //calendario principal
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    locales: [esLocale],
    locale: 'es',
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    editable: true,
    selectable: true,
    selectMirror: true,
    slotDuration: '01:00:00',       // Cambia el tamaño del "bloque" visible a 1 hora
    slotLabelInterval: '01:00',     // Etiquetas del lado izquierdo cada 1 hora
    selectOverlap: false,
  };
  //calendario del modal de creacion de citas
  calendarModalOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    locales: [esLocale],
    locale: 'es',
    dateClick: this.handleDateClickModal.bind(this),
    // eventClick: this.handleEventClick.bind(this),
    editable: true,
    selectable: true,
    selectMirror: true,
    slotDuration: '01:00:00',       // Cambia el tamaño del "bloque" visible a 1 hora
    slotLabelInterval: '01:00',     // Etiquetas del lado izquierdo cada 1 hora
    selectOverlap: false,
  };
  //calendario del modal de actualizacion de citas
  calendarModalUpdateOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    locales: [esLocale],
    locale: 'es',
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    editable: true,
    selectable: true,
    selectMirror: true,
    slotDuration: '01:00:00',       // Cambia el tamaño del "bloque" visible a 1 hora
    slotLabelInterval: '01:00',     // Etiquetas del lado izquierdo cada 1 hora
    selectOverlap: false,
  };


  mostrarModal: boolean = false;
  mostrarModalActualizar: boolean = false;
  user_id:number = -1;
  pacientes: any [] = [];
  //Fin Variables

  constructor(private citasServices: CitasService, private usuarioServices:UsuariosService ,private Router: Router) { 

  }

  ngOnInit() {
    this.user_id = localStorage.getItem('usuario') ? JSON.parse(localStorage.getItem('usuario') || '{}').id_usuario : -1;
    // console.log(this.user_id)
    if (this.user_id==-1){
      this.Router.navigate(['/login']);
    }
    this.obtenerCitas();
  }

  obtenerCitas() {
    this.citasServices.getCitasPaciente(this.user_id).subscribe({
      next: (response) => {
        console.log(response)
        this.calendarModalUpdateOptions.events =  this.calendarOptions.events = response.map(aux => this.estilosCitas(aux.estado, aux.paciente_nombre, aux.fecha, aux.id_cita))
        
      }
    })
  }


  agendarCita() {
    this.new_cita.paciente_id = this.user_id;
    
    console.log(this.new_cita);
    this.mostrarModal = false
    this.citasServices.createCita(this.new_cita).subscribe({
      next: (response) => {
        // console.log('Cita creada:', response);
        this.obtenerCitas(); // Actualizar las citas después de crear una nueva
        this.new_cita = { ...this.cita_predefinida }; // Reiniciar el formulario
      }
      ,
      error: (error) => {
        console.error('Error al crear la cita:', error);
      }
    });
  }


  handleDateClick(arg: any) {
    // console.log(this.calendarOptions.eventContent?.toString())
    const fechaSeleccionada = new Date(arg.date);
    this.cita.fecha = new Date(fechaSeleccionada); // Fecha con hora
    // console.log(this.cita.fecha.toLocaleString());
    // console.log(fechaSeleccionada)

  }

  handleEventClick(arg: any) {
    const event = arg.event;
    let auxfecha = event.start;
    const fechaSeleccionada = new Date(arg.date);
    // this.cita.fecha = new Date(fechaSeleccionada); // Fecha con hora
    console.log("fecha de actualizacion",this.cita.fecha.toLocaleString());
    // this.mostrarModal=true
    this.citasServices.getCitaById(event.extendedProps.id_cita).subscribe({
      next: (response) => {
        // console.log(response);
        this.cita = response;
        this.cita.fecha = auxfecha
        this.mostrarModalActualizar = true; // Mostrar el modal de actualización
      },
      error: (error) => {
        console.error('Error al obtener la cita:', error);
      }
    });
  }



  estilosCitas(estado: string, descripcion: string, fecha: Date, id: number) {
    switch (estado) {
      case 'cancelada':
        return {
          title: descripcion,
          start: fecha,
          textColor: "#ffffff",
          color: "#dc3545",
          extendedProps: {
            id_cita: id
          }
        };
      case 'terminada':
        return {
          title: descripcion,
          start: fecha,
          textColor: "#ffffff",
          color: "#007bff",
          extendedProps: {
            id_cita: id
          }
        }
      case 'proxima':
        return {
          title: descripcion,
          start: fecha,
          textColor: "#ffffff",
          color: "#28a745",
          extendedProps: {
            id_cita: id
          }
        }
      case 'en confirmacion':
        return {
          title: descripcion,
          start: fecha,
          textColor: "#000000",
          color: "#ffc107",
          extendedProps: {
            id_cita: id
          }
        }
      default:
        return {
          title: descripcion,
          start: fecha,
          extendedProps: {
            id_cita: id
          }
        }
    }
  }
  
  abirModal() {
    this.usuarioServices.getUsuariosByRol('especialista').subscribe({
      next: (response) => {
        // console.log(response);
        this.pacientes = response;
      },
      error: (error) => {
        console.error('Error al obtener especialista:', error);
      }
    });
    this.mostrarModal = true;
  
  }
 
  handleDateClickModal(arg: any) {
    const fechaSeleccionada = new Date(arg.date);
    this.new_cita.fecha = new Date(fechaSeleccionada); // Fecha con hora
    // console.log(this.new_cita.fecha.toLocaleString());

  }

  actualizarCita() {
    this.citasServices.updateCita(this.cita.id_cita, this.cita).subscribe({
      next: (response) => {
        // console.log('Cita actualizada:', response);
        this.obtenerCitas(); // Actualizar las citas después de actualizar una
        this.mostrarModalActualizar = false; // Cerrar el modal después de actualizar la cita
      
      },
      error: (error) => {
        console.error('Error al actualizar la cita:', error);
      }
    });
    this.mostrarModalActualizar = false; // Cerrar el modal después de actualizar la cita 
  }
}
