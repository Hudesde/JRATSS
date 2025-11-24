export class CitaModel {
    id_cita: number;
    fecha: string;
    hora: string;
    paciente_id: number;
    terapeuta_id: number;
    estado: string;

    constructor(id_cita: number, fecha: string, hora: string, paciente_id: number, terapeuta_id: number, estado: string) {
        this.id_cita = id_cita;
        this.fecha = fecha;
        this.hora = hora;
        this.paciente_id = paciente_id;
        this.terapeuta_id = terapeuta_id;
        this.estado = estado;
    }
}