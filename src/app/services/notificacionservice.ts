import { Injectable, signal } from '@angular/core';

export interface Notificacion {
  id: number;
  mensaje: string;
  fecha: Date;
  leida: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  notificaciones = signal<Notificacion[]>([]);

  private siguienteId = 1;

  agregar(mensaje: string): void {
    const nueva: Notificacion = {
      id: this.siguienteId++,
      mensaje: mensaje,
      fecha: new Date(),
      leida: false,
    };

    this.notificaciones.update((lista) => [nueva, ...lista]);
  }

  marcarComoLeida(id: number): void {
    this.notificaciones.update((lista) =>
      lista.map((notificacion) =>
        notificacion.id === id ? { ...notificacion, leida: true } : notificacion,
      ),
    );
  }

  marcarTodasComoLeidas(): void {
    this.notificaciones.update((lista) =>
      lista.map((notificacion) => ({
        ...notificacion,
        leida: true,
      })),
    );
  }

  eliminar(id: number): void {
    this.notificaciones.update((lista) => lista.filter((notificacion) => notificacion.id !== id));
  }

  limpiar(): void {
    this.notificaciones.set([]);
  }

  cantidadNoLeidas(): number {
    return this.notificaciones().filter((notificacion) => !notificacion.leida).length;
  }
}
