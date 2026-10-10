import { Injectable, signal } from '@angular/core';
import { Authservice } from './authservice';
import { NotificacionService } from './notificacionservice';

@Injectable({
  providedIn: 'root',
})
export class Favoritosservice {
  private favoritosPorUsuario = signal<Record<string, number[]>>({});

  constructor(
    private authService: Authservice,
    private notificacionService: NotificacionService,
  ) {}

  esFavorito(id: number): boolean {
    return this.obtenerIds().includes(id);
  }

  alternar(id: number): boolean {
    const usuario = this.authService.usuarioActual();

    if (!usuario) {
      return false;
    }

    const actuales = this.obtenerIds();

    const yaEsFavorito = actuales.includes(id);

    const nuevos = yaEsFavorito
      ? actuales.filter((favorito) => favorito !== id)
      : [...actuales, id];

    this.favoritosPorUsuario.update((favoritos) => ({
      ...favoritos,
      [usuario.correo]: nuevos
    }));

    if (yaEsFavorito) {
      this.notificacionService.agregar(
        'El alojamiento fue eliminado de tus favoritos.'
      );
    } else {
      this.notificacionService.agregar(
        'El alojamiento fue agregado a tus favoritos.'
      );
    }

    return true;
  }
  obtenerIds(): number[] {
    const usuario = this.authService.usuarioActual();
    return usuario ? (this.favoritosPorUsuario()[usuario.correo] ?? []) : [];
  }
}
