import { Component, OnInit, signal } from '@angular/core';
import { Reservasservice, Reserva } from '../../services/reservasservice';
import { Authservice, Usuario } from '../../services/authservice';

declare const Swal: any;

@Component({
  selector: 'app-misreservascomponent',
  standalone: false,
  styleUrl: './misreservascomponent.css',
  templateUrl: './misreservascomponent.html',
})
export class Misreservascomponent implements OnInit {
  reservas = signal<Reserva[]>([]);

  constructor(
    private reservasService: Reservasservice,
    private authService: Authservice,
  ) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  usuarioActual(): Usuario | null {
    return this.authService.usuarioActual();
  }

  cancelar(reserva: Reserva): void {
    Swal.fire({
      icon: 'warning',
      title: '¿Cancelar la reserva?',
      html: `Reserva #${reserva.id} en <strong>${reserva.nombreAlojamiento}</strong><br>Las fechas volverán a quedar disponibles.`,
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, conservar',
      confirmButtonColor: '#dc3545',
      background: '#181b25',
      color: '#dfe2ef',
    }).then((resultado: { isConfirmed: boolean }) => {
      if (resultado.isConfirmed) {
        this.reservasService.cancelarReserva(reserva.id);
        this.cargarReservas();
      }
    });
  }

  private cargarReservas(): void {
    const usuario = this.usuarioActual();
    this.reservas.set(usuario ? this.reservasService.obtenerReservasDe(usuario.correo) : []);
  }
}
