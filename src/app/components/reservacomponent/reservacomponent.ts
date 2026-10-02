import { Component, Input, inject } from '@angular/core';
import { Alojamiento } from '../../services/alojamientosservice';
import { Reservasservice } from '../../services/reservasservice';
import { ToastService } from '../../services/toastservice';
import { Cotizacion } from '../cotizadorcomponent/cotizadorcomponent';

@Component({
  selector: 'app-reservacomponent',
  standalone: false,
  styleUrl: './reservacomponent.css',
  templateUrl: './reservacomponent.html',
})
export class Reservacomponent {
  private toast = inject(ToastService);

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
      this.toast.warning(this.errorFormulario);
      return;
    }

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correo);
    if (!correoValido) {
      this.errorFormulario = 'Ingresa un correo válido.';
      this.toast.warning(this.errorFormulario);
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

    this.toast.success(`¡Reserva #${reserva.id} confirmada en ${reserva.nombreAlojamiento}!`);
  }
}
