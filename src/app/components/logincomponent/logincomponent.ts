import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Authservice } from '../../services/authservice';
import { ToastService } from '../../services/toastservice';

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
  private toast = inject(ToastService);

  constructor(
    private authService: Authservice,
    private router: Router,
  ) {}

  iniciarSesion(): void {
    if (!this.correo.trim() || !this.password.trim()) {
      this.toast.warning('Ingresa tu correo y contraseña.');
      return;
    }

    const resultado = this.authService.iniciarSesion(this.correo.trim(), this.password);
    if (!resultado.exito) {
      this.toast.error(resultado.error ?? 'No se pudo iniciar sesión.');
      return;
    }

    this.toast.success('¡Bienvenido de nuevo!');
    this.router.navigateByUrl('/');
  }
}
