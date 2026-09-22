import { Component, OnInit, signal } from '@angular/core';
import { Reservasservice, Reserva } from '../../services/reservasservice';

@Component({
  selector: 'app-misreservascomponent',
  standalone: false,
  styleUrl: './misreservascomponent.css',
  templateUrl: './misreservascomponent.html',
})
export class Misreservascomponent implements OnInit {
  reservas = signal<Reserva[]>([]);

  constructor(private reservasService: Reservasservice) {}

  ngOnInit(): void {
    this.reservas.set(this.reservasService.obtenerReservas());
  }
}
