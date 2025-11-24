import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { AppComponent } from './app.component';
import { PerfilPsicometricoComponent } from './components/perfil-psicometrico/perfil-psicometrico.component';
import { LoginComponent } from './components/login/login.component';
import { BigfiveTestComponent } from './components/bigfive-test/bigfive-test.component';


@NgModule({
  imports: [
    BrowserModule,
    CommonModule,  
    HttpClientModule, 
    RouterModule.forRoot(routes),
    AppComponent,
    LoginComponent,
    PerfilPsicometricoComponent,
    BigfiveTestComponent
  ],

  providers: []
})
export class AppModule { }
