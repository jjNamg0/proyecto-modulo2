import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Authservice } from '../../services/authservice';
import { ToastService } from '../../services/toastservice';

@Component({
  selector: 'app-registrocomponent',
  standalone: false,
  styleUrl: './registrocomponent.css',
  templateUrl: './registrocomponent.html',
})
export class Registrocomponent {
  private toast = inject(ToastService);

  nombre = '';
  correo = '';
  password = '';
  errorRegistro = '';

  constructor(
    private authService: Authservice,
    private router: Router,
  ) {}

  registrar(): void {
    this.errorRegistro = '';

    if (!this.nombre.trim() || !this.correo.trim() || !this.password.trim()) {
      this.errorRegistro = 'Completa todos los campos.';
      this.toast.warning(this.errorRegistro);
      return;
    }

    if (this.password.length < 4) {
      this.errorRegistro = 'La contraseña debe tener al menos 4 caracteres.';
      this.toast.warning(this.errorRegistro);
      return;
    }

    const resultado = this.authService.registrar({
      nombre: this.nombre.trim(),
      correo: this.correo.trim(),
      password: this.password,
    });

    if (!resultado.exito) {
      this.errorRegistro = resultado.error ?? 'No se pudo crear la cuenta.';
      this.toast.error(this.errorRegistro);
      return;
    }

    this.toast.success('Cuenta creada correctamente');
    this.router.navigateByUrl('/');
  }
}
