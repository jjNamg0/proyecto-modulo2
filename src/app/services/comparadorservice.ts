import { Injectable, signal } from '@angular/core';
import { Toastservice } from './toastservice';

@Injectable({
  providedIn: 'root',
})
export class Comparadorservice {
  readonly MAXIMO = 3;

  private ids = signal<number[]>([]);

  constructor(private toastService: Toastservice) {}

  obtenerIds(): number[] {
    return this.ids();
  }

  cantidad(): number {
    return this.ids().length;
  }

  estaEnComparador(id: number): boolean {
    return this.ids().includes(id);
  }

  alternar(id: number): void {
    if (this.estaEnComparador(id)) {
      this.quitar(id);
      this.toastService.mostrar('Alojamiento quitado del comparador.');
      return;
    }

    if (this.cantidad() >= this.MAXIMO) {
      this.toastService.mostrar(`Solo puedes comparar hasta ${this.MAXIMO} alojamientos a la vez.`, 'error');
      return;
    }

    this.ids.update((ids) => [...ids, id]);
    this.toastService.mostrar(`Agregado al comparador (${this.cantidad()} de ${this.MAXIMO}).`);
  }

  quitar(id: number): void {
    this.ids.update((ids) => ids.filter((actual) => actual !== id));
  }

  limpiar(): void {
    this.ids.set([]);
  }
}
