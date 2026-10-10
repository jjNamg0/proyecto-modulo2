import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Alojamiento } from '../../services/alojamientosservice';
import { Reservasservice } from '../../services/reservasservice';
import { Authservice, Usuario } from '../../services/authservice';
import { Cupon, Cuponesservice } from '../../services/cuponesservice';
import { Cotizacion } from '../cotizadorcomponent/cotizadorcomponent';

declare const Swal: any;

@Component({
  selector: 'app-pagocomponent',
  standalone: false,
  styleUrl: './pagocomponent.css',
  templateUrl: './pagocomponent.html',
})
export class Pagocomponent implements OnChanges {
  @Input() alojamiento!: Alojamiento;
  @Input() cotizacion!: Cotizacion;
  @Output() pagoRealizado = new EventEmitter<void>();

  nombreTarjeta = '';
  numeroTarjeta = '';
  vencimiento = '';
  cvv = '';
  errorPago = '';

  codigoCupon = '';
  cuponAplicado: Cupon | null = null;
  descuento = 0;
  errorCupon = '';

  constructor(
    private reservasService: Reservasservice,
    private authService: Authservice,
    private cuponesService: Cuponesservice,
    private router: Router,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cotizacion'] && this.cuponAplicado) {
      const codigo = this.cuponAplicado.codigo;
      this.validarCupon(codigo);
      if (!this.cuponAplicado) {
        this.codigoCupon = codigo;
      }
    }
  }

  usuarioActual(): Usuario | null {
    return this.authService.usuarioActual();
  }

  totalAPagar(): number {
    return this.cotizacion.total - this.descuento;
  }

  aplicarCupon(): void {
    this.validarCupon(this.codigoCupon);
    if (this.cuponAplicado) {
      this.codigoCupon = '';
    }
  }

  quitarCupon(): void {
    this.cuponAplicado = null;
    this.descuento = 0;
    this.errorCupon = '';
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

    const disponible = this.reservasService.estaDisponible(
      this.alojamiento.id,
      this.cotizacion.fechaInicio,
      this.cotizacion.fechaFin,
    );
    if (!disponible) {
      this.errorPago = 'Este alojamiento ya está reservado en esas fechas.';
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
      precioNoche: this.alojamiento.precioNoche,
      subtotal: this.cotizacion.subtotal,
      tarifaLimpieza: this.cotizacion.tarifaLimpieza,
      tarifaServicio: this.cotizacion.tarifaServicio,
      codigoCupon: this.cuponAplicado?.codigo ?? null,
      descuento: this.descuento,
      total: this.totalAPagar(),
    });

    this.nombreTarjeta = '';
    this.numeroTarjeta = '';
    this.vencimiento = '';
    this.cvv = '';
    this.codigoCupon = '';
    this.quitarCupon();

    Swal.fire({
      icon: 'success',
      title: '¡Pago confirmado!',
      html: `Reserva #${reserva.id} para <strong>${reserva.nombreAlojamiento}</strong><br>Estado: ${reserva.estado}`,
      showCancelButton: true,
      confirmButtonText: 'Ver comprobante',
      cancelButtonText: 'Listo',
      background: '#181b25',
      color: '#dfe2ef',
    }).then((resultado: { isConfirmed: boolean }) => {
      if (resultado.isConfirmed) {
        this.router.navigate(['/mis-reservas', reserva.id]);
      }
    });

    this.pagoRealizado.emit();
  }

  private validarCupon(codigo: string): void {
    this.errorCupon = '';
    const resultado = this.cuponesService.validar(codigo, this.cotizacion.noches, this.cotizacion.subtotal);

    if (!resultado.exito) {
      this.cuponAplicado = null;
      this.descuento = 0;
      this.errorCupon = resultado.error ?? 'No se pudo aplicar el cupón.';
      return;
    }

    this.cuponAplicado = resultado.cupon ?? null;
    this.descuento = resultado.descuento ?? 0;
  }
}
