import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Authservice } from '../../services/authservice';

@Component({
  selector: 'app-logincomponent',
  standalone: false,
  styleUrl: './logincomponent.css',
  templateUrl: './logincomponent.html',
})
export class Logincomponent {
  correo = '';
  password = '';
  errorLogin = '';

  constructor(
    private authService: Authservice,
    private router: Router,
  ) {}

  iniciarSesion(): void {
    this.errorLogin = '';

    if (!this.correo.trim() || !this.password.trim()) {
      this.errorLogin = 'Ingresa tu correo y contraseña.';
      return;
    }

    const resultado = this.authService.iniciarSesion(this.correo.trim(), this.password);
    if (!resultado.exito) {
      this.errorLogin = resultado.error ?? 'No se pudo iniciar sesión.';
      return;
    }

    this.router.navigateByUrl('/');
  }
}
