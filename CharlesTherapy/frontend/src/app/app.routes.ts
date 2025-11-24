import { Routes } from '@angular/router';
import { PrincipalComponent } from './components/principal/principal.component';
import { HistorialComponent } from './components/historial/historial.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { PerfilPsicometricoComponent } from './components/perfil-psicometrico/perfil-psicometrico.component';
import { CitasComponent } from './components/citas/citas.component';
import { CitasPacienteComponent } from './components/citas-paciente/citas-paciente.component';
import { BigfiveTestComponent } from './components/bigfive-test/bigfive-test.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: PrincipalComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'perfilPsicometrico', component: PerfilPsicometricoComponent },
  { path: 'historial', component: HistorialComponent },
  { path: 'citas/especialista', component: CitasComponent },
  { path: 'citas/paciente', component: CitasPacienteComponent },
  { path: 'bigfive', component: BigfiveTestComponent },
  { path: 'chatbot', component: ChatbotComponent },
];
