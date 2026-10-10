import { Injectable, signal } from '@angular/core';
import { Authservice } from './authservice';

export interface Notificacion {
  id: number;
  mensaje: string;
  fecha: Date;
  leida: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class Notificacionservice {
  private notificacionesPorUsuario = signal<Record<string, Notificacion[]>>({});
  private siguienteId = 1;

  constructor(private authService: Authservice) {}

  notificaciones(): Notificacion[] {
    const usuario = this.authService.usuarioActual();
    return usuario ? (this.notificacionesPorUsuario()[usuario.correo] ?? []) : [];
  }

  cantidadNoLeidas(): number {
    return this.notificaciones().filter((notificacion) => !notificacion.leida).length;
  }

  agregar(mensaje: string): void {
    const nueva: Notificacion = {
      id: this.siguienteId++,
      mensaje,
      fecha: new Date(),
      leida: false,
    };
    this.actualizarLista((lista) => [nueva, ...lista]);
  }

  marcarComoLeida(id: number): void {
    this.actualizarLista((lista) =>
      lista.map((notificacion) => (notificacion.id === id ? { ...notificacion, leida: true } : notificacion)),
    );
  }

  marcarTodasComoLeidas(): void {
    this.actualizarLista((lista) => lista.map((notificacion) => ({ ...notificacion, leida: true })));
  }

  private actualizarLista(cambio: (lista: Notificacion[]) => Notificacion[]): void {
    const usuario = this.authService.usuarioActual();
    if (!usuario) {
      return;
    }
    this.notificacionesPorUsuario.update((todas) => ({
      ...todas,
      [usuario.correo]: cambio(todas[usuario.correo] ?? []),
    }));
  }
}
