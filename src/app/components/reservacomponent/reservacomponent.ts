import { Component, Input } from '@angular/core';
import { Alojamiento } from '../../services/alojamientosservice';
import { Reservasservice } from '../../services/reservasservice';
import { Cotizacion } from '../cotizadorcomponent/cotizadorcomponent';

declare const Swal: any;

@Component({
  selector: 'app-reservacomponent',
  standalone: false,
  styleUrl: './reservacomponent.css',
  templateUrl: './reservacomponent.html',
})
export class Reservacomponent {
  @Input() alojamiento!: Alojamiento;
  @Input() cotizacion!: Cotizacion;

  nombre = '';
  correo = '';
  errorFormulario = '';

  constructor(private reservasService: Reservasservice) {}

  reservar(): void {
    this.errorFormulario = '';

    if (!this.nombre.trim() || !this.correo.trim()) {
      this.errorFormulario = 'Ingresa tu nombre y correo para reservar.';
      return;
    }

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correo);
    if (!correoValido) {
      this.errorFormulario = 'Ingresa un correo válido.';
      return;
    }

    const reserva = this.reservasService.crearReserva({
      alojamientoId: this.alojamiento.id,
      nombreAlojamiento: this.alojamiento.nombre,
      nombreHuesped: this.nombre.trim(),
      correoHuesped: this.correo.trim(),
      fechaInicio: this.cotizacion.fechaInicio,
      fechaFin: this.cotizacion.fechaFin,
      noches: this.cotizacion.noches,
      huespedes: this.cotizacion.huespedes,
      total: this.cotizacion.total,
    });

    this.nombre = '';
    this.correo = '';

    Swal.fire({
      icon: 'success',
      title: '¡Reserva confirmada!',
      html: `Reserva #${reserva.id} para <strong>${reserva.nombreAlojamiento}</strong><br>Estado: ${reserva.estado}`,
      confirmButtonText: 'Listo',
      background: '#181b25',
      color: '#dfe2ef',
    });
  }
}
