import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Alojamiento } from '../../services/alojamientosservice';
import { Reservasservice, RangoFechas } from '../../services/reservasservice';
import { Exchangerateservice, Moneda } from '../../services/exchangerateservice';

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

  fechaMinima = this.obtenerFechaLocalHoy();

  fechaInicio = '';
  fechaFin = '';
  huespedes = 1;

  cotizacion: Cotizacion | null = null;
  errorFechas = '';
  errorCapacidad = '';

  constructor(
    private reservasService: Reservasservice,
    private exchangeRateService: Exchangerateservice,
  ) {}

  convertir(valorEnCop: number): number {
    return this.exchangeRateService.convertir(valorEnCop);
  }

  monedaActiva(): Moneda {
    return this.exchangeRateService.monedaActiva();
  }

  formatoDecimales(): string {
    return this.exchangeRateService.formatoDecimales();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const cambio = changes['alojamiento'];
    if (cambio && cambio.previousValue?.id !== cambio.currentValue?.id) {
      this.reiniciar();
    }
  }

  fechasOcupadas(): RangoFechas[] {
    return this.reservasService.obtenerFechasOcupadas(this.alojamiento.id);
  }

  reiniciar(): void {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.huespedes = 1;
    this.errorFechas = '';
    this.errorCapacidad = '';
    this.actualizarCotizacion(null);
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

    if (!this.reservasService.estaDisponible(this.alojamiento.id, this.fechaInicio, this.fechaFin)) {
      this.errorFechas = 'Este alojamiento ya está reservado en esas fechas.';
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

  private obtenerFechaLocalHoy(): string {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }
}
