import { Component, OnInit, signal } from '@angular/core';
import { Alojamientosservice, Alojamiento, Filtros, FILTROS_VACIOS } from '../../services/alojamientosservice';
import { Favoritosservice } from '../../services/favoritosservice';

@Component({
  selector: 'app-listadocomponent',
  standalone: false,
  styleUrl: './listadocomponent.css',
  templateUrl: './listadocomponent.html',
})
export class Listadocomponent implements OnInit {
  alojamientos = signal<Alojamiento[]>([]);
  paises = signal<string[]>([]);
  ciudades = signal<string[]>([]);
  tipos = signal<string[]>([]);
  cargando = signal(true);

  constructor(
    private alojamientosService: Alojamientosservice,
    private favoritosService: Favoritosservice,
  ) {}

  esFavorito(id: number): boolean {
    return this.favoritosService.esFavorito(id);
  }

  alternarFavorito(id: number, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.favoritosService.alternar(id);
  }

  ngOnInit(): void {
    this.alojamientosService.obtenerPaises().subscribe((paises) => this.paises.set(paises));
    this.alojamientosService.obtenerTipos().subscribe((tipos) => this.tipos.set(tipos));
    this.aplicarFiltros(FILTROS_VACIOS);
  }

  aplicarFiltros(filtros: Filtros): void {
    this.cargando.set(true);
    this.alojamientosService.obtenerCiudades(filtros.pais).subscribe((ciudades) => this.ciudades.set(ciudades));
    this.alojamientosService.filtrar(filtros).subscribe((alojamientos) => {
      this.alojamientos.set(alojamientos);
      this.cargando.set(false);
    });
  }

  onImgError(event: Event, id: number): void {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    img.src = `https://picsum.photos/seed/alojamiento-${id}/600/400`;
  }
}
