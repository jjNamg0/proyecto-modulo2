import { Injectable, signal } from '@angular/core';
import { Authservice } from './authservice';
import { Notificacionservice } from './notificacionservice';
import { Toastservice } from './toastservice';

@Injectable({
  providedIn: 'root',
})
export class Favoritosservice {
  private favoritosPorUsuario = signal<Record<string, number[]>>({});

  constructor(
    private authService: Authservice,
    private notificacionService: Notificacionservice,
    private toastService: Toastservice,
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
    const yaEraFavorito = actuales.includes(id);
    const nuevos = yaEraFavorito ? actuales.filter((favorito) => favorito !== id) : [...actuales, id];
    this.favoritosPorUsuario.update((favoritos) => ({ ...favoritos, [usuario.correo]: nuevos }));

    const mensaje = yaEraFavorito
      ? 'El alojamiento fue eliminado de tus favoritos.'
      : 'El alojamiento fue agregado a tus favoritos.';
    this.toastService.mostrar(mensaje);
    this.notificacionService.agregar(mensaje);
    return true;
  }

  obtenerIds(): number[] {
    const usuario = this.authService.usuarioActual();
    return usuario ? (this.favoritosPorUsuario()[usuario.correo] ?? []) : [];
  }
}
