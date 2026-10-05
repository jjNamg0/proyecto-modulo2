import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Authservice } from './authservice';

@Injectable({
  providedIn: 'root',
})
export class Authguardservice {
  constructor(
    private authService: Authservice,
    private router: Router,
  ) {}

  verificarSesion(urlDestino: string): boolean | UrlTree {
    if (this.authService.usuarioActual()) {
      return true;
    }
    return this.router.createUrlTree(['/login'], { queryParams: { volverA: urlDestino } });
  }

  destinoSeguro(volverA: string | null): string {
    if (volverA && volverA.startsWith('/') && !volverA.startsWith('//')) {
      return volverA;
    }
    return '/';
  }
}
