import { Component, OnInit, signal } from '@angular/core';
import { Alojamiento, Alojamientosservice } from '../../services/alojamientosservice';
import { Comparadorservice } from '../../services/comparadorservice';

@Component({
  selector: 'app-comparadorcomponent',
  standalone: false,
  styleUrl: './comparadorcomponent.css',
  templateUrl: './comparadorcomponent.html',
})
export class Comparadorcomponent implements OnInit {
  alojamientos = signal<Alojamiento[]>([]);
  cargando = signal(true);

  constructor(
    private alojamientosService: Alojamientosservice,
    private comparadorService: Comparadorservice,
  ) {}

  ngOnInit(): void {
    const ids = this.comparadorService.obtenerIds();
    this.alojamientosService.obtenerAlojamientos().subscribe((todos) => {
      this.alojamientos.set(
        ids.map((id) => todos.find((a) => a.id === id)).filter((a): a is Alojamiento => a !== undefined),
      );
      this.cargando.set(false);
    });
  }

  maximo(): number {
    return this.comparadorService.MAXIMO;
  }

  quitar(id: number): void {
    this.comparadorService.quitar(id);
    this.alojamientos.update((lista) => lista.filter((a) => a.id !== id));
  }

  limpiar(): void {
    this.comparadorService.limpiar();
    this.alojamientos.set([]);
  }

  esMasBarato(alojamiento: Alojamiento): boolean {
    return this.hayVarios() && alojamiento.precioNoche === Math.min(...this.alojamientos().map((a) => a.precioNoche));
  }

  esMejorCalificado(alojamiento: Alojamiento): boolean {
    const mejor = Math.max(...this.alojamientos().map((a) => a.calificacion));
    return this.hayVarios() && mejor > 0 && alojamiento.calificacion === mejor;
  }

  tieneMasCapacidad(alojamiento: Alojamiento): boolean {
    return this.hayVarios() && alojamiento.capacidad === Math.max(...this.alojamientos().map((a) => a.capacidad));
  }

  onImgError(event: Event, id: number): void {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    img.src = `https://picsum.photos/seed/alojamiento-${id}/800/500`;
  }

  private hayVarios(): boolean {
    return this.alojamientos().length > 1;
  }
}
