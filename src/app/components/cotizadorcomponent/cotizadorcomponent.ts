import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Alojamiento } from '../../services/alojamientosservice';

// esto lo consume tambien el reservacomponent, x eso lleva las fechas y huespedes completos
export interface Cotizacion {
  fechaInicio: string;
  fechaFin: string;
  huespedes: number;
  noches: number;
  subtotal: number;
  tarifaLimpieza: number;
  tarifaServicio: number;
  total: number;
}

@Component({
  selector: 'app-cotizadorcomponent',
  standalone: false,
  styleUrl: './cotizadorcomponent.css',
  templateUrl: './cotizadorcomponent.html',
})
export class Cotizadorcomponent implements OnChanges {
  @Input() alojamiento!: Alojamiento;
  @Output() cotizacionLista = new EventEmitter<Cotizacion | null>();

  // pa no dejar elegir fechas pasadas desde el input mismo
  fechaMinima = new Date().toISOString().split('T')[0];

  fechaInicio = '';
  fechaFin = '';
  huespedes = 1;

  cotizacion: Cotizacion | null = null;
  errorFechas = '';
  errorCapacidad = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['alojamiento']) {
      this.fechaInicio = '';
      this.fechaFin = '';
      this.huespedes = 1;
      this.errorFechas = '';
      this.errorCapacidad = '';
      this.actualizarCotizacion(null);
    }
  }

  calcular(): void {
    this.errorFechas = '';
    this.errorCapacidad = '';

    if (!this.fechaInicio || !this.fechaFin) {
      this.actualizarCotizacion(null);
      return;
    }

    if (this.fechaInicio < this.fechaMinima) {
      this.errorFechas = 'La fecha de entrada no puede ser anterior a hoy.';
      this.actualizarCotizacion(null);
      return;
    }

    const inicio = new Date(this.fechaInicio);
    const fin = new Date(this.fechaFin);
    const noches = Math.round((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));

    if (noches <= 0) {
      this.errorFechas = 'La fecha de salida debe ser posterior a la de entrada.';
      this.actualizarCotizacion(null);
      return;
    }

    if (this.huespedes < 1) {
      this.errorCapacidad = 'Debes cotizar para al menos 1 huésped.';
      this.actualizarCotizacion(null);
      return;
    }

    if (this.huespedes > this.alojamiento.capacidad) {
      this.errorCapacidad = `Este alojamiento admite hasta ${this.alojamiento.capacidad} huéspedes.`;
      this.actualizarCotizacion(null);
      return;
    }

    const subtotal = noches * this.alojamiento.precioNoche;
    const tarifaServicio = subtotal * 0.1;
    const total = subtotal + this.alojamiento.tarifaLimpieza + tarifaServicio;

    this.actualizarCotizacion({
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      huespedes: this.huespedes,
      noches,
      subtotal,
      tarifaLimpieza: this.alojamiento.tarifaLimpieza,
      tarifaServicio,
      total,
    });
  }

  private actualizarCotizacion(cotizacion: Cotizacion | null): void {
    this.cotizacion = cotizacion;
    this.cotizacionLista.emit(cotizacion);
  }
}
