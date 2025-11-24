import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BigFiveService } from '../../../services/bigfive.service';
import { BigFiveResult } from '../../../models/bigfive.model';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  estadoAnimo: string = 'neutral';
  colorClase: string = 'sidebar-neutral';
  rol: string = '';
  rolNormalizado: string = '';
  isBrowser: boolean;
  bigFiveResult: BigFiveResult | null = null;
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private bigFiveService: BigFiveService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // Utilidad para verificar si localStorage está disponible
  isLocalStorageAvailable(): boolean {
    if (!this.isBrowser) return false;
    try {
      const testKey = '__test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  ngOnInit() {
    if (this.isLocalStorageAvailable()) {
      const usuarioStr = localStorage.getItem('usuario');
      this.rol = usuarioStr ? JSON.parse(usuarioStr).rol : 'paciente';
      this.rolNormalizado = (this.rol || '').toLowerCase();
      const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
      if (usuario && usuario.id_usuario) {
        this.bigFiveService.getResultsByUser(usuario.id_usuario).subscribe({
          next: (resultados: BigFiveResult[]) => {
            if (resultados.length > 0) {
              this.bigFiveResult = resultados[resultados.length - 1];
              this.setColorByBigFive(this.bigFiveResult);
            } else {
              this.setColorByBigFive(null);
            }
          },
          error: () => this.setColorByBigFive(null)
        });
        return;
      }
    }
    if (!this.rolNormalizado) {
      this.rolNormalizado = 'paciente';
    }
    this.setColorByBigFive(null);
  }

  setColorByBigFive(bigFive: BigFiveResult | null = null) {
    // Si no hay resultado o TODOS los valores son exactamente 0, mostrar azul marino
    if (!bigFive || [bigFive.apertura, bigFive.responsabilidad, bigFive.extraversion, bigFive.amabilidad, bigFive.neuroticismo].every(v => Number(v) === 0)) {
      this.colorClase = 'sidebar-azulmarino';
      return;
    }
    // Ajuste de criterios para escala 0-5
    let danger = 0, normal = 0, healthy = 0;
    // Alto: > 3.75, Promedio: 2-3.75, Bajo: < 2
    if (bigFive.apertura > 3.75) healthy++; else if (bigFive.apertura < 2) danger++; else normal++;
    if (bigFive.responsabilidad > 3.75) healthy++; else if (bigFive.responsabilidad < 2) danger++; else normal++;
    if (bigFive.extraversion > 3.75) healthy++; else if (bigFive.extraversion < 2) danger++; else normal++;
    if (bigFive.amabilidad > 3.75) healthy++; else if (bigFive.amabilidad < 2) danger++; else normal++;
    // Neuroticismo: Alto (dañino) > 3, Promedio 1.5-3, Bajo (bien) < 1.5
    if (bigFive.neuroticismo > 3) danger++; else if (bigFive.neuroticismo < 1.5) healthy++; else normal++;
    if (danger >= 2) this.colorClase = 'sidebar-danger';
    else if (healthy >= 3) this.colorClase = 'sidebar-healthy';
    else this.colorClase = 'sidebar-normal';
  }

  getColorClass(estado: string): string {
    switch (estado) {
      case 'feliz': return 'sidebar-feliz';
      case 'triste': return 'sidebar-triste';
      case 'ansioso': return 'sidebar-ansioso';
      case 'enojado': return 'sidebar-enojado';
      case 'neutral':
      default: return 'sidebar-neutral';
    }
  }

  cerrarSesion(): void {
    if (this.isBrowser) {
      localStorage.clear(); // O localStorage.removeItem('usuario');
    }
    this.router.navigate(['/login']); // Cambia '/login' por tu ruta de inicio de sesión
  }
}
