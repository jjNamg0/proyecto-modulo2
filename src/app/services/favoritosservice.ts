import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Favoritosservice {
  private favoritos = signal<Set<number>>(new Set());

  esFavorito(id: number): boolean {
    return this.favoritos().has(id);
  }

  alternar(id: number): void {
    const actuales = new Set(this.favoritos());
    if (actuales.has(id)) {
      actuales.delete(id);
    } else {
      actuales.add(id);
    }
    this.favoritos.set(actuales);
  }

  obtenerIds(): number[] {
    return [...this.favoritos()];
  }
}
