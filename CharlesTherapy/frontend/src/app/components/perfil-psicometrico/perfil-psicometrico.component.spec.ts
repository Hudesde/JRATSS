import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { PerfilPsicometricoComponent } from './perfil-psicometrico.component';

// Mock de OpenAI
class OpenAIMock {
  chat = {
    completions: {
      create: jasmine.createSpy().and.returnValue(Promise.resolve({
        choices: [{ message: { content: 'Recomiendo un psicólogo clínico.' } }]
      }))
    }
  };
}

describe('PerfilPsicometricoComponent', () => {
  let component: PerfilPsicometricoComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        PerfilPsicometricoComponent,  // Como es standalone
        HttpClientModule              // Si tu componente o servicios lo usan
      ]
    });

    const fixture = TestBed.createComponent(PerfilPsicometricoComponent);
    component = fixture.componentInstance;

    // Inyectar mock de OpenAI manualmente
    (component as any).openai = new OpenAIMock();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería devolver "bajo" si el valor es menor a 40', () => {
    expect(component.getColor(25)).toBe('bajo');
  });

  it('debería devolver "medio" si el valor está entre 40 y 69', () => {
    expect(component.getColor(50)).toBe('medio');
  });

  it('debería devolver "alto" si el valor es 70 o más', () => {
    expect(component.getColor(85)).toBe('alto');
  });

  it('debería calcular correctamente el ancho respecto a 100', () => {
    expect(component.getWidth(0)).toBe(0);
    expect(component.getWidth(50)).toBe(50);
    expect(component.getWidth(100)).toBe(100);
  });

  it('debería obtener una recomendación de la IA', async () => {
    await component.obtenerRecomendacion();
    expect(component.recomendacion).toBe('Recomiendo un psicólogo clínico.');
    expect(component.loading).toBeFalse();
  });
});
