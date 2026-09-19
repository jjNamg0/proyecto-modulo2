import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Alojamiento } from '../../services/alojamientosservice';

interface Cotizacion {
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
      this.cotizacion = null;
      this.errorFechas = '';
      this.errorCapacidad = '';
    }
  }

  calcular(): void {
    this.errorFechas = '';
    this.errorCapacidad = '';
    this.cotizacion = null;

    if (!this.fechaInicio || !this.fechaFin) {
      return;
    }

    const inicio = new Date(this.fechaInicio);
    const fin = new Date(this.fechaFin);
    const noches = Math.round((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));

    if (noches <= 0) {
      this.errorFechas = 'La fecha de salida debe ser posterior a la de entrada.';
      return;
    }

    if (this.huespedes < 1) {
      this.errorCapacidad = 'Debes cotizar para al menos 1 huésped.';
      return;
    }

    if (this.huespedes > this.alojamiento.capacidad) {
      this.errorCapacidad = `Este alojamiento admite hasta ${this.alojamiento.capacidad} huéspedes.`;
      return;
    }

    const subtotal = noches * this.alojamiento.precioNoche;
    const tarifaServicio = subtotal * 0.1;
    const total = subtotal + this.alojamiento.tarifaLimpieza + tarifaServicio;

    this.cotizacion = {
      noches,
      subtotal,
      tarifaLimpieza: this.alojamiento.tarifaLimpieza,
      tarifaServicio,
      total,
    };
  }
}
