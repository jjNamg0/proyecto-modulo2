import { Injectable } from '@angular/core';
import { NotificacionService } from './notificacionservice';
import { Emailservice } from './emailservice';

export type EstadoReserva = 'CONFIRMADA' | 'CANCELADA';

export interface Reserva {
  id: number;
  alojamientoId: number;
  nombreAlojamiento: string;
  ciudad: string;
  nombreHuesped: string;
  correoHuesped: string;
  fechaInicio: string;
  fechaFin: string;
  noches: number;
  huespedes: number;
  total: number;
  estado: EstadoReserva;
  fechaCreacion: Date;
}

export interface DatosReserva {
  alojamientoId: number;
  nombreAlojamiento: string;
  ciudad: string;
  nombreHuesped: string;
  correoHuesped: string;
  fechaInicio: string;
  fechaFin: string;
  noches: number;
  huespedes: number;
  total: number;
}

export interface RangoFechas {
  fechaInicio: string;
  fechaFin: string;
}

@Injectable({
  providedIn: 'root',
})
export class Reservasservice {
  private reservas: Reserva[] = [];
  private siguienteId = 1;

  constructor(
    private notificacionService: NotificacionService,
    private emailservice: Emailservice
  ) {}

  crearReserva(datos: DatosReserva): Reserva {
    const reserva: Reserva = {
      ...datos,
      id: this.siguienteId++,
      estado: 'CONFIRMADA',
      fechaCreacion: new Date(),
    };

    this.reservas.push(reserva);

    this.notificacionService.agregar(
      `Tu reserva en ${reserva.nombreAlojamiento} fue creada correctamente.`
    );

    this.emailservice
      .enviarConfirmacion({
        to_email: reserva.correoHuesped,
        to_name: reserva.nombreHuesped,
        alojamiento: reserva.nombreAlojamiento,
        fecha_entrada: reserva.fechaInicio,
        fecha_salida: reserva.fechaFin,
        valor: reserva.total.toLocaleString('es-CO', {
          style: 'currency',
          currency: 'COP',
          maximumFractionDigits: 0,
        }),
      })
      .then(() => {
        this.notificacionService.agregar(
          `Enviamos la confirmación de tu reserva al correo ${reserva.correoHuesped}.`
        );
      })
      .catch((error: unknown) => {
        console.error('Error al enviar el correo de confirmación:', error);
        this.notificacionService.agregar(
          'La reserva se creó, pero no pudimos enviar el correo de confirmación.'
        );
      });

    return reserva;
  }

  obtenerReservasDe(correo: string): Reserva[] {
    return this.reservas
      .filter((r) => r.correoHuesped === correo)
      .sort((a, b) => b.id - a.id);
  }

  cancelarReserva(id: number): void {
    const reserva = this.reservas.find((r) => r.id === id);

    if (reserva) {
      reserva.estado = 'CANCELADA';

      this.notificacionService.agregar(
        `Tu reserva en ${reserva.nombreAlojamiento} fue cancelada correctamente.`
      );
    }
  }

  obtenerFechasOcupadas(alojamientoId: number): RangoFechas[] {
    return this.reservas
      .filter(
        (r) =>
          r.alojamientoId === alojamientoId &&
          r.estado === 'CONFIRMADA'
      )
      .map((r) => ({
        fechaInicio: r.fechaInicio,
        fechaFin: r.fechaFin,
      }))
      .sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio));
  }

  estaDisponible(
    alojamientoId: number,
    fechaInicio: string,
    fechaFin: string
  ): boolean {
    return !this.obtenerFechasOcupadas(alojamientoId).some(
      (ocupada) =>
        fechaInicio < ocupada.fechaFin &&
        fechaFin > ocupada.fechaInicio
    );
  }
}
