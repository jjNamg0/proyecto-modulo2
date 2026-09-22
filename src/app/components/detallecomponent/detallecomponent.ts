import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Alojamientosservice, Alojamiento, Resena } from '../../services/alojamientosservice';
import { Cotizacion } from '../cotizadorcomponent/cotizadorcomponent';

@Component({
  selector: 'app-detallecomponent',
  standalone: false,
  styleUrl: './detallecomponent.css',
  templateUrl: './detallecomponent.html',
})
export class Detallecomponent implements OnInit {
  alojamiento = signal<Alojamiento | null>(null);
  resenas = signal<Resena[]>([]);
  imagenActiva = signal('');
  cargando = signal(true);
  noEncontrado = signal(false);
  cotizacionActual = signal<Cotizacion | null>(null);

  constructor(
    private route: ActivatedRoute,
    private alojamientosService: Alojamientosservice,
  ) {}

  ngOnInit(): void {
    // uso paramMap x si el usuario navega de un detalle a otro sin q se destruya el componente
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.cargarAlojamiento(id);
    });
  }

  onCotizacionLista(cotizacion: Cotizacion | null): void {
    this.cotizacionActual.set(cotizacion);
  }

  private cargarAlojamiento(id: number): void {
    this.cargando.set(true);
    this.noEncontrado.set(false);
    this.cotizacionActual.set(null);

    this.alojamientosService.obtenerPorId(id).subscribe((alojamiento) => {
      if (!alojamiento) {
        this.noEncontrado.set(true);
        this.cargando.set(false);
        return;
      }

      this.alojamiento.set(alojamiento);
      this.imagenActiva.set(alojamiento.imagenPrincipal);
      this.cargando.set(false);

      this.alojamientosService.obtenerResenasPorAlojamiento(id).subscribe((resenas) => {
        this.resenas.set(resenas);
      });
    });
  }

  cambiarImagen(url: string): void {
    this.imagenActiva.set(url);
  }

  onImgError(event: Event, id: number): void {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    img.src = `https://picsum.photos/seed/alojamiento-${id}/800/500`;
  }
}
