import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { BigFiveQuestion, BigFiveResult } from '../../../models/bigfive.model';
import { BigFiveService } from '../../../services/bigfive.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-bigfive-test',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './bigfive-test.component.html',
  styleUrls: ['./bigfive-test.component.css']
})
export class BigfiveTestComponent {
  bigFiveForm: FormGroup;
  questions: BigFiveQuestion[] = [
    // Sección 1: Neuroticismo
    { text: 'Me preocupo por todo.', trait: 'neuroticismo', section: 1 },
    { text: 'Me enfado con facilidad.', trait: 'neuroticismo', section: 1 },
    { text: 'A menudo me siento triste.', trait: 'neuroticismo', section: 1 },
    { text: 'Entro en pánico con facilidad.', trait: 'neuroticismo', section: 1 },
    { text: 'Me dan miedo muchas cosas.', trait: 'neuroticismo', section: 1 },
    { text: 'A veces no me gusto.', trait: 'neuroticismo', section: 1 },
    { text: 'Siento que no soy capaz de hacer frente a las cosas.', trait: 'neuroticismo', section: 1 },
    { text: 'Me estreso con facilidad.', trait: 'neuroticismo', section: 1 },
    { text: 'Suelo dejar todas mis cosas desperdigadas.', trait: 'neuroticismo', section: 1 },
    { text: 'Me preocupo por todo.', trait: 'neuroticismo', section: 1 },
    // Sección 2: Extraversión
    { text: 'Hago amigos con facilidad.', trait: 'extraversión', section: 2 },
    { text: 'Disfruto mucho en las grandes fiestas y reuniones.', trait: 'extraversión', section: 2 },
    { text: 'Me gusta hacerme cargo de la situación.', trait: 'extraversión', section: 2 },
    { text: 'Siempre estoy ocupado, de aquí para allá.', trait: 'extraversión', section: 2 },
    { text: 'Soy una persona muy alegre.', trait: 'extraversión', section: 2 },
    { text: 'Me siento cómodo rodeado de gente.', trait: 'extraversión', section: 2 },
    { text: 'Intento estar al mando y liderar a los demás.', trait: 'extraversión', section: 2 },
    { text: 'Hago muchas cosas en mi tiempo libre.', trait: 'extraversión', section: 2 },
    { text: 'Adoro la vida.', trait: 'extraversión', section: 2 },
    { text: 'Me gusta tomar riesgos.', trait: 'extraversión', section: 2 },
    // Sección 3: Apertura a la experiencia
    { text: 'Tengo mucha imaginación.', trait: 'apertura', section: 3 },
    { text: 'Creo que el arte es importante.', trait: 'apertura', section: 3 },
    { text: 'Disfruto leyendo libros y artículos interesantes.', trait: 'apertura', section: 3 },
    { text: 'Veo belleza en cosas que para otras personas pueden pasar inadvertidas.', trait: 'apertura', section: 3 },
    { text: 'Prefiero la variedad a la rutina.', trait: 'apertura', section: 3 },
    { text: 'Me encanta discutir o pelear.', trait: 'apertura', section: 3 },
    { text: 'Me gusta soñar despierto.', trait: 'apertura', section: 3 },
    { text: 'Creo que no existe el Bien o el Mal absoluto.', trait: 'apertura', section: 3 },
    { text: 'Me gusta abstraerme.', trait: 'apertura', section: 3 },
    { text: 'No me interesan las discusiones teóricas.', trait: 'apertura', section: 3 },
    // Sección 4: Amabilidad
    { text: 'Confío en los demás.', trait: 'amabilidad', section: 4 },
    { text: 'Me encanta ayudar a los demás.', trait: 'amabilidad', section: 4 },
    { text: 'Siempre cumplo mis promesas.', trait: 'amabilidad', section: 4 },
    { text: 'Soy empático, capto las emociones de los demás.', trait: 'amabilidad', section: 4 },
    { text: 'Me solidarizo con los indigentes.', trait: 'amabilidad', section: 4 },
    { text: 'Intento no pensar en los necesitados.', trait: 'amabilidad', section: 4 },
    { text: 'Procuro mantener las distancias con los demás.', trait: 'amabilidad', section: 4 },
    { text: 'No me interesan los problemas de los demás.', trait: 'amabilidad', section: 4 },
    { text: 'Actúo sin pensar.', trait: 'amabilidad', section: 4 },
    { text: 'Rompo las reglas.', trait: 'amabilidad', section: 4 },
    // Sección 5: Responsabilidad
    { text: 'Completo las tareas con éxito.', trait: 'responsabilidad', section: 5 },
    { text: 'Me gusta ordenar las cosas.', trait: 'responsabilidad', section: 5 },
    { text: 'Siempre estoy preparado para lo que sea.', trait: 'responsabilidad', section: 5 },
    { text: 'Trabajo muy duro.', trait: 'responsabilidad', section: 5 },
    { text: 'Trabajo lo justo y necesario.', trait: 'responsabilidad', section: 5 },
    { text: 'Hago excesos algunas veces.', trait: 'responsabilidad', section: 5 },
    { text: 'Sé cómo hacer las cosas.', trait: 'responsabilidad', section: 5 },
    { text: 'Resisto las tentaciones fácilmente.', trait: 'responsabilidad', section: 5 },
    { text: 'Soy capaz de controlar mis deseos.', trait: 'responsabilidad', section: 5 },
    { text: 'A veces engaño a los demás para salirme con la mía.', trait: 'responsabilidad', section: 5 },
  ];
  result: BigFiveResult | null = null;
  userId: number = 0; // Reemplaza por el id real del usuario autenticado

  @Output() completed = new EventEmitter<void>();

  currentPage = 0;
  pageSize = 10;

  bigFiveTraits = [
    { key: 'neuroticismo', label: 'Neuroticismo' },
    { key: 'extraversion', label: 'Extraversión' },
    { key: 'apertura', label: 'Apertura' },
    { key: 'amabilidad', label: 'Amabilidad' },
    { key: 'responsabilidad', label: 'Responsabilidad' }
  ];

  constructor(
    private fb: FormBuilder,
    private bigFiveService: BigFiveService,
    private usuariosService: UsuariosService
  ) {
    this.bigFiveForm = this.fb.group({
      responses: this.fb.array(
        this.questions.map(() => this.fb.control<number | null>(null, Validators.required))
      )
    });

    const usuarioStr = localStorage.getItem('usuario');
    const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;

    if (usuario && usuario.id_usuario) {
      this.userId = Number(usuario.id_usuario);
      console.log('ID de usuario obtenido del localStorage:', this.userId);
    } else {
      console.warn('No se encontró el ID del usuario en el localStorage.');
    }

  }

  get pagedQuestions(): BigFiveQuestion[] {
    const start = this.currentPage * this.pageSize;
    return this.questions.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.questions.length / this.pageSize);
  }

  nextPage() {
    if ((this.currentPage + 1) * this.pageSize < this.questions.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  getQuestionsBySection(section: number) {
    return this.questions.filter(q => q.section === section);
  }

  getFormIndex(q: BigFiveQuestion): string {
    return this.questions.indexOf(q).toString();
  }

  getSectionTitle(section: number): string {
    switch (section) {
      case 1: return 'Neuroticismo';
      case 2: return 'Extraversión';
      case 3: return 'Apertura a la experiencia';
      case 4: return 'Amabilidad';
      case 5: return 'Responsabilidad';
      default: return '';
    }
  }

  // Cambia el valor de bigFive a 1 para el usuario actual
  marcarBigFiveCompletado(): void {
    this.usuariosService.getUsuarioById(this.userId).subscribe({
      next: (usuario) => {
        // Solo actualiza el campo bigFive, deja los demás datos igual
        const update = { ...usuario, bigFive: 1 };
        this.usuariosService.updateUsuario(this.userId, update).subscribe({
          next: () => {
            // Opcional: feedback visual
            // alert('Estado Big Five actualizado.');
          },
          error: () => {
            alert('Error al actualizar el estado Big Five del usuario.');
          }
        });
      },
      error: () => {
        alert('No se pudo obtener el usuario para actualizar Big Five.');
      }
    });
  }

  submit() {
    const values: number[] = (this.bigFiveForm.value.responses as (number | null)[]).map((v: number | null) => +(v ?? 0));
    const traits: any = {
      neuroticismo: 0,
      extraversión: 0,
      apertura: 0,
      amabilidad: 0,
      responsabilidad: 0,
    };
    const counts = {
      neuroticismo: 0,
      extraversión: 0,
      apertura: 0,
      amabilidad: 0,
      responsabilidad: 0,
    };
    this.questions.forEach((q, i) => {
      traits[q.trait] += +values[i];
      counts[q.trait]++;
    });
    // Calcular promedios
    const traitAverages = {
      neuroticismo: traits.neuroticismo / counts.neuroticismo,
      extraversion: traits['extraversión'] / counts['extraversión'],
      apertura: traits.apertura / counts.apertura,
      amabilidad: traits.amabilidad / counts.amabilidad,
      responsabilidad: traits.responsabilidad / counts.responsabilidad
    };
    const result: any = {
      id_usuario: this.userId,
      neuroticismo: traitAverages.neuroticismo,
      extraversion: traitAverages.extraversion,
      apertura: traitAverages.apertura,
      amabilidad: traitAverages.amabilidad,
      responsabilidad: traitAverages.responsabilidad
    };
    this.bigFiveService.saveResult(result).subscribe({
      next: () => {
        this.marcarBigFiveCompletado();
        this.result = result;
        alert('Resultados guardados correctamente.');
        this.completed.emit();
      },
      error: () => {
        alert('Error al guardar resultados.');
      }
    });
  }

  getWidth(valor: number, max: number = 5): number {
    return Math.round((valor / max) * 100);
  }

  getColor(valor: number): string {
    if (valor >= 4) return 'alto';
    if (valor >= 2.5) return 'medio';
    return 'bajo';
  }

  // Helper para indexar con string en BigFiveResult
  getResultValue(result: BigFiveResult, key: string): number {
    // @ts-ignore
    return result[key];
  }
}
