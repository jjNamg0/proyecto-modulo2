import { Injectable, signal } from '@angular/core';
import { Authservice } from './authservice';

@Injectable({
  providedIn: 'root',
})
export class Favoritosservice {
  private favoritosPorUsuario = signal<Record<string, number[]>>({});

  constructor(private authService: Authservice) {}

  esFavorito(id: number): boolean {
    return this.obtenerIds().includes(id);
  }

  alternar(id: number): boolean {
    const usuario = this.authService.usuarioActual();
    if (!usuario) {
      return false;
    }

    const actuales = this.obtenerIds();
    const nuevos = actuales.includes(id) ? actuales.filter((favorito) => favorito !== id) : [...actuales, id];
    this.favoritosPorUsuario.update((favoritos) => ({ ...favoritos, [usuario.correo]: nuevos }));
    return true;
  }

  obtenerIds(): number[] {
    const usuario = this.authService.usuarioActual();
    return usuario ? (this.favoritosPorUsuario()[usuario.correo] ?? []) : [];
  }
}
