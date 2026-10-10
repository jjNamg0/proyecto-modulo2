import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Reserva, Reservasservice } from '../../services/reservasservice';
import { Authservice } from '../../services/authservice';

@Component({
  selector: 'app-comprobantecomponent',
  standalone: false,
  styleUrl: './comprobantecomponent.css',
  templateUrl: './comprobantecomponent.html',
})
export class Comprobantecomponent implements OnInit {
  reserva = signal<Reserva | null>(null);
  noEncontrada = signal(false);

  constructor(
    private route: ActivatedRoute,
    private reservasService: Reservasservice,
    private authService: Authservice,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      const usuario = this.authService.usuarioActual();
      const reserva = usuario ? this.reservasService.obtenerReservaDe(id, usuario.correo) : undefined;
      this.reserva.set(reserva ?? null);
      this.noEncontrada.set(!reserva);
    });
  }

  numeroComprobante(id: number): string {
    return `NS-${String(id).padStart(6, '0')}`;
  }

  imprimir(): void {
    window.print();
  }
}
