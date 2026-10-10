import { Injectable, signal } from '@angular/core';

export type TipoToast = 'exito' | 'error';

@Injectable({
  providedIn: 'root',
})
export class Toastservice {
  private readonly DURACION = 3000;
  private temporizador: ReturnType<typeof setTimeout> | null = null;

  mensaje = signal('');
  tipo = signal<TipoToast>('exito');

  mostrar(mensaje: string, tipo: TipoToast = 'exito'): void {
    this.detenerTemporizador();
    this.mensaje.set(mensaje);
    this.tipo.set(tipo);
    this.temporizador = setTimeout(() => this.cerrar(), this.DURACION);
  }

  cerrar(): void {
    this.detenerTemporizador();
    this.mensaje.set('');
  }

  private detenerTemporizador(): void {
    if (this.temporizador) {
      clearTimeout(this.temporizador);
      this.temporizador = null;
    }
  }
}
