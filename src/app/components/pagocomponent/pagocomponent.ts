import { Component, Input } from '@angular/core';
import { Alojamiento } from '../../services/alojamientosservice';
import { Reservasservice } from '../../services/reservasservice';
import { Authservice, Usuario } from '../../services/authservice';
import { Cotizacion } from '../cotizadorcomponent/cotizadorcomponent';

declare const Swal: any;

@Component({
  selector: 'app-pagocomponent',
  standalone: false,
  styleUrl: './pagocomponent.css',
  templateUrl: './pagocomponent.html',
})
export class Pagocomponent {
  @Input() alojamiento!: Alojamiento;
  @Input() cotizacion!: Cotizacion;

  nombreTarjeta = '';
  numeroTarjeta = '';
  vencimiento = '';
  cvv = '';
  errorPago = '';

  constructor(
    private reservasService: Reservasservice,
    private authService: Authservice,
  ) {}

  usuarioActual(): Usuario | null {
    return this.authService.usuarioActual();
  }

  formatearNumeroTarjeta(valor: string): void {
    const soloDigitos = valor.replace(/\D/g, '').slice(0, 16);
    this.numeroTarjeta = soloDigitos.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  formatearVencimiento(valor: string): void {
    const soloDigitos = valor.replace(/\D/g, '').slice(0, 4);
    this.vencimiento = soloDigitos.length > 2 ? `${soloDigitos.slice(0, 2)}/${soloDigitos.slice(2)}` : soloDigitos;
  }

  pagar(): void {
    this.errorPago = '';
    const usuario = this.usuarioActual();

    if (!usuario) {
      this.errorPago = 'Debes iniciar sesión para completar el pago.';
      return;
    }

    if (!this.nombreTarjeta.trim()) {
      this.errorPago = 'Ingresa el nombre que aparece en la tarjeta.';
      return;
    }

    const numeroLimpio = this.numeroTarjeta.replace(/\s/g, '');
    if (!/^\d{16}$/.test(numeroLimpio)) {
      this.errorPago = 'El número de tarjeta debe tener 16 dígitos.';
      return;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(this.vencimiento)) {
      this.errorPago = 'La fecha de vencimiento debe tener el formato MM/AA.';
      return;
    }

    if (!/^\d{3}$/.test(this.cvv)) {
      this.errorPago = 'El CVV debe tener 3 dígitos.';
      return;
    }

    const reserva = this.reservasService.crearReserva({
      alojamientoId: this.alojamiento.id,
      nombreAlojamiento: this.alojamiento.nombre,
      ciudad: this.alojamiento.ciudad,
      nombreHuesped: usuario.nombre,
      correoHuesped: usuario.correo,
      fechaInicio: this.cotizacion.fechaInicio,
      fechaFin: this.cotizacion.fechaFin,
      noches: this.cotizacion.noches,
      huespedes: this.cotizacion.huespedes,
      total: this.cotizacion.total,
    });

    this.nombreTarjeta = '';
    this.numeroTarjeta = '';
    this.vencimiento = '';
    this.cvv = '';

    Swal.fire({
      icon: 'success',
      title: '¡Pago confirmado!',
      html: `Reserva #${reserva.id} para <strong>${reserva.nombreAlojamiento}</strong><br>Estado: ${reserva.estado}`,
      confirmButtonText: 'Listo',
      background: '#181b25',
      color: '#dfe2ef',
    });
  }
}
