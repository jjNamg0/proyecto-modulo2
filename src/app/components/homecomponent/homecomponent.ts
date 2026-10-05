import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Alojamientosservice, Alojamiento } from '../../services/alojamientosservice';
import { Favoritosservice } from '../../services/favoritosservice';

@Component({
  selector: 'app-homecomponent',
  standalone: false,
  styleUrl: './homecomponent.css',
  templateUrl: './homecomponent.html',
})
export class Homecomponent implements OnInit, OnDestroy {
  destacados = signal<Alojamiento[]>([]);
  indiceActivo = signal(0);

  private readonly TIEMPO_POR_SLIDE = 5000;
  private intervalo: ReturnType<typeof setInterval> | null = null;

  constructor(
    private alojamientosService: Alojamientosservice,
    private favoritosService: Favoritosservice,
  ) {}

  ngOnInit(): void {
    this.alojamientosService.obtenerDestacados(5).subscribe((alojamientos) => {
      this.destacados.set(alojamientos);
      this.iniciarAutoplay();
    });
  }

  ngOnDestroy(): void {
    this.detenerAutoplay();
  }

  siguiente(): void {
    const total = this.destacados().length;
    this.indiceActivo.update((indice) => (indice + 1) % total);
  }

  anterior(): void {
    const total = this.destacados().length;
    this.indiceActivo.update((indice) => (indice - 1 + total) % total);
  }

  irA(indice: number): void {
    this.indiceActivo.set(indice);
  }

  iniciarAutoplay(): void {
    this.detenerAutoplay();
    if (this.destacados().length > 1) {
      this.intervalo = setInterval(() => this.siguiente(), this.TIEMPO_POR_SLIDE);
    }
  }

  detenerAutoplay(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
  }

  esFavorito(id: number): boolean {
    return this.favoritosService.esFavorito(id);
  }

  alternarFavorito(id: number, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.favoritosService.alternar(id);
  }

  onImgError(event: Event, id: number): void {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    img.src = `https://picsum.photos/seed/alojamiento-${id}/1200/600`;
  }
}
