import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Authservice } from '../../services/authservice';
import { Authguardservice } from '../../services/authguardservice';

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
    private authguardService: Authguardservice,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  vieneDeRutaProtegida(): boolean {
    return this.route.snapshot.queryParamMap.has('volverA');
  }

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

    const volverA = this.route.snapshot.queryParamMap.get('volverA');
    this.router.navigateByUrl(this.authguardService.destinoSeguro(volverA));
  }
}
