import { Component } from '@angular/core';
import { Toastservice } from '../../services/toastservice';

@Component({
  selector: 'app-toastcomponent',
  standalone: false,
  styleUrl: './toastcomponent.css',
  templateUrl: './toastcomponent.html',
})
export class Toastcomponent {
  constructor(private toastService: Toastservice) {}

  mensaje(): string {
    return this.toastService.mensaje();
  }

  esError(): boolean {
    return this.toastService.tipo() === 'error';
  }

  cerrar(): void {
    this.toastService.cerrar();
  }
}
