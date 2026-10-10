import { Injectable } from '@angular/core';
import { Notificacionservice } from './notificacionservice';

export type EstadoReserva = 'CONFIRMADA' | 'CANCELADA';

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
  precioNoche: number;
  subtotal: number;
  tarifaLimpieza: number;
  tarifaServicio: number;
  codigoCupon: string | null;
  descuento: number;
  total: number;
}

export interface Reserva extends DatosReserva {
  id: number;
  estado: EstadoReserva;
  fechaCreacion: Date;
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

  constructor(private notificacionService: Notificacionservice) {}

  crearReserva(datos: DatosReserva): Reserva {
    const reserva: Reserva = {
      ...datos,
      id: this.siguienteId++,
      estado: 'CONFIRMADA',
      fechaCreacion: new Date(),
    };

    this.reservas.push(reserva);
    this.notificacionService.agregar(`Tu reserva en ${reserva.nombreAlojamiento} fue creada correctamente.`);
    return reserva;
  }

  obtenerReservasDe(correo: string): Reserva[] {
    return this.reservas.filter((r) => r.correoHuesped === correo).sort((a, b) => b.id - a.id);
  }

  obtenerReservaDe(id: number, correo: string): Reserva | undefined {
    return this.reservas.find((r) => r.id === id && r.correoHuesped === correo);
  }

  cancelarReserva(id: number): void {
    const reserva = this.reservas.find((r) => r.id === id);
    if (reserva) {
      reserva.estado = 'CANCELADA';
      this.notificacionService.agregar(`Tu reserva en ${reserva.nombreAlojamiento} fue cancelada correctamente.`);
    }
  }

  obtenerFechasOcupadas(alojamientoId: number): RangoFechas[] {
    return this.reservas
      .filter((r) => r.alojamientoId === alojamientoId && r.estado === 'CONFIRMADA')
      .map((r) => ({ fechaInicio: r.fechaInicio, fechaFin: r.fechaFin }))
      .sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio));
  }

  estaDisponible(alojamientoId: number, fechaInicio: string, fechaFin: string): boolean {
    return !this.obtenerFechasOcupadas(alojamientoId).some(
      (ocupada) => fechaInicio < ocupada.fechaFin && fechaFin > ocupada.fechaInicio,
    );
  }
}
