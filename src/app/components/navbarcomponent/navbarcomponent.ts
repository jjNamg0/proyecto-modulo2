
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Authservice, Usuario } from '../../services/authservice';
import { Notificacion, Notificacionservice } from '../../services/notificacionservice';

type Idioma = 'es' | 'en' | 'ja' | 'pt';

@Component({
  selector: 'app-navbarcomponent',
  standalone: false,
  styleUrl: './navbarcomponent.css',
  templateUrl: './navbarcomponent.html',
})
export class Navbarcomponent {
  menuAbierto = signal(false);
  panelNotificacionesAbierto = signal(false);

  idiomaActual: Idioma = 'es';

  private readonly RUTAS_CON_SESION = [
    '/mis-reservas',
    '/favoritos',
    '/publicar',
    '/perfil',
  ];

  private readonly IDIOMAS_VALIDOS: Idioma[] = ['es', 'en', 'ja', 'pt'];

  constructor(
    private authService: Authservice,
    private notificacionService: Notificacionservice,
    private router: Router,
    private translate: TranslateService,
  ) {
    const idiomaGuardado = localStorage.getItem('idioma');

    const idiomaInicial: Idioma =
      idiomaGuardado && this.IDIOMAS_VALIDOS.includes(idiomaGuardado as Idioma)
        ? (idiomaGuardado as Idioma)
        : 'es';

    this.translate.setFallbackLang('es');
    this.cambiarIdioma(idiomaInicial);
  }

  cambiarIdioma(idioma: Idioma): void {
    if (!this.IDIOMAS_VALIDOS.includes(idioma)) {
      return;
    }

    this.idiomaActual = idioma;
    localStorage.setItem('idioma', idioma);
    this.translate.use(idioma);
  }

  usuarioActual(): Usuario | null {
    return this.authService.usuarioActual();
  }

  notificaciones(): Notificacion[] {
    return this.notificacionService.notificaciones();
  }

  cantidadNoLeidas(): number {
    return this.notificacionService.cantidadNoLeidas();
  }

  marcarComoLeida(id: number): void {
    this.notificacionService.marcarComoLeida(id);
  }

  marcarTodasComoLeidas(): void {
    this.notificacionService.marcarTodasComoLeidas();
  }

  toggleMenu(): void {
    this.panelNotificacionesAbierto.set(false);
    this.menuAbierto.update((abierto) => !abierto);
  }

  toggleNotificaciones(): void {
    this.menuAbierto.set(false);
    this.panelNotificacionesAbierto.update((abierto) => !abierto);
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.cerrarMenu();
    this.panelNotificacionesAbierto.set(false);

    if (this.RUTAS_CON_SESION.some((ruta) => this.router.url.startsWith(ruta))) {
      this.router.navigateByUrl('/');
    }
  }
}
