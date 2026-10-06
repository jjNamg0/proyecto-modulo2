import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Authservice } from '../../services/authservice';
import { Authguardservice } from '../../services/authguardservice';

@Component({
  selector: 'app-registrocomponent',
  standalone: false,
  styleUrl: './registrocomponent.css',
  templateUrl: './registrocomponent.html',
})
export class Registrocomponent {
  nombre = '';
  correo = '';
  password = '';
  errorRegistro = '';

  constructor(
    private authService: Authservice,
    private authguardService: Authguardservice,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  registrar(): void {
    this.errorRegistro = '';

    if (!this.nombre.trim() || !this.correo.trim() || !this.password.trim()) {
      this.errorRegistro = 'Completa todos los campos.';
      return;
    }

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correo.trim());
    if (!correoValido) {
      this.errorRegistro = 'Ingresa un correo válido.';
      return;
    }

    if (this.password.length < 4) {
      this.errorRegistro = 'La contraseña debe tener al menos 4 caracteres.';
      return;
    }

    const resultado = this.authService.registrar({
      nombre: this.nombre.trim(),
      correo: this.correo.trim(),
      password: this.password,
    });

    if (!resultado.exito) {
      this.errorRegistro = resultado.error ?? 'No se pudo crear la cuenta.';
      return;
    }

    const volverA = this.route.snapshot.queryParamMap.get('volverA');
    this.router.navigateByUrl(this.authguardService.destinoSeguro(volverA));
  }
}
