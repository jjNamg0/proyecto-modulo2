import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Alojamientosservice } from '../../services/alojamientosservice';
import { Authservice, Usuario } from '../../services/authservice';

@Component({
  selector: 'app-resenaformcomponent',
  standalone: false,
  styleUrl: './resenaformcomponent.css',
  templateUrl: './resenaformcomponent.html',
})
export class Resenaformcomponent {
  @Input() alojamientoId!: number;
  @Output() resenaAgregada = new EventEmitter<void>();

  calificacion = 5;
  comentario = '';
  errorResena = '';

  constructor(
    private alojamientosService: Alojamientosservice,
    private authService: Authservice,
  ) {}

  usuarioActual(): Usuario | null {
    return this.authService.usuarioActual();
  }

  enviarResena(): void {
    this.errorResena = '';
    const usuario = this.usuarioActual();

    if (!usuario) {
      this.errorResena = 'Debes iniciar sesión para dejar una reseña.';
      return;
    }

    if (!this.comentario.trim()) {
      this.errorResena = 'Escribe un comentario para tu reseña.';
      return;
    }

    this.alojamientosService.agregarResena({
      alojamientoId: this.alojamientoId,
      usuario: usuario.nombre,
      calificacion: Number(this.calificacion),
      comentario: this.comentario.trim(),
    });

    this.comentario = '';
    this.calificacion = 5;
    this.resenaAgregada.emit();
  }
}
