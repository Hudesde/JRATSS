import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  nombre = '';
  email = '';
  password = '';
  tipo = '';
  edad: number | null = null;
  cedula = ''; // Nueva variable
  especialidad = ''; // Nueva variable
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private usuariosService: UsuariosService, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.nombre || !this.email || !this.password || !this.tipo || !this.edad) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }
    if (this.tipo === 'Especialista' && (!this.cedula || !this.especialidad)) {
      this.errorMessage = 'Por favor, ingresa tu cédula profesional y especialidad.';
      return;
    }
    this.loading = true;
    // Ajusta los nombres de los campos según espera tu backend
    const usuario: any = {
      usuario: this.nombre,
      correo: this.email,
      password: this.password,
      rol: this.tipo,
      edad: this.edad,
      cedula: this.tipo === 'Especialista' ? this.cedula : null,
      especialidad: this.tipo === 'Especialista' ? this.especialidad : null // Solo se envía si es especialista
    };
    this.usuariosService.createUsuario(usuario).subscribe({
      next: (res) => {
        this.successMessage = 'Registro exitoso. Redirigiendo a login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al registrar usuario.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
