import { Injectable } from '@angular/core';

export interface Reserva {
  id: number;
  alojamientoId: number;
  nombreAlojamiento: string;
  nombreHuesped: string;
  correoHuesped: string;
  fechaInicio: string;
  fechaFin: string;
  noches: number;
  huespedes: number;
  total: number;
  estado: 'CONFIRMADA';
  fechaCreacion: Date;
}

export interface DatosReserva {
  alojamientoId: number;
  nombreAlojamiento: string;
  nombreHuesped: string;
  correoHuesped: string;
  fechaInicio: string;
  fechaFin: string;
  noches: number;
  huespedes: number;
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class Reservasservice {
  private reservas: Reserva[] = [];
  private siguienteId = 1;

  crearReserva(datos: DatosReserva): Reserva {
    const reserva: Reserva = {
      ...datos,
      id: this.siguienteId++,
      estado: 'CONFIRMADA',
      fechaCreacion: new Date(),
    };

    this.reservas.push(reserva);
    return reserva;
  }
}
