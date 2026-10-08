import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Authservice, Usuario } from '../../services/authservice';
import{NotificacionService} from '../../services/notificacionservice';

@Component({
  selector: 'app-navbarcomponent',
  standalone: false,
  styleUrl: './navbarcomponent.css',
  templateUrl: './navbarcomponent.html',
})
export class Navbarcomponent {
  menuAbierto = signal(false);
  panelNotificacionesAbierto = signal(false);


  private readonly RUTAS_CON_SESION = [
    '/mis-reservas',
    '/favoritos',
    '/publicar',
    '/perfil'
  ];

  constructor(
    private authService: Authservice,
    private router: Router,
    public notificacionService: NotificacionService,

  ) {}

  usuarioActual(): Usuario | null {
    return this.authService.usuarioActual();
  }

  toggleMenu(): void {
    this.menuAbierto.update((abierto) => !abierto);
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.cerrarMenu();

    if (this.RUTAS_CON_SESION.some((ruta) => this.router.url.startsWith(ruta))) {
      this.router.navigateByUrl('/');
    }
  }
  toggleNotificaciones(): void {
    this.panelNotificacionesAbierto.update(abierto => !abierto);
  }
}
