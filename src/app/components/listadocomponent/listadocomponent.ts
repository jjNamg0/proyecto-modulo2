import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Alojamientosservice, Alojamiento, Filtros, FILTROS_VACIOS } from '../../services/alojamientosservice';
import { Favoritosservice } from '../../services/favoritosservice';

@Component({
  selector: 'app-listadocomponent',
  standalone: false,
  styleUrl: './listadocomponent.css',
  templateUrl: './listadocomponent.html',
})
export class Listadocomponent implements OnInit {
  readonly TAMANO_PAGINA = 9;

  alojamientos = signal<Alojamiento[]>([]);
  paises = signal<string[]>([]);
  ciudades = signal<string[]>([]);
  tipos = signal<string[]>([]);
  cargando = signal(true);
  paginaActual = signal(1);

  constructor(
    private alojamientosService: Alojamientosservice,
    private favoritosService: Favoritosservice,
    private router: Router,
  ) {}

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
      this.paginaActual.set(1);
      this.cargando.set(false);
    });
  }

  totalPaginas(): number {
    return Math.ceil(this.alojamientos().length / this.TAMANO_PAGINA);
  }

  paginas(): number[] {
    return Array.from({ length: this.totalPaginas() }, (_, indice) => indice + 1);
  }

  alojamientosDePagina(): Alojamiento[] {
    const inicio = (this.paginaActual() - 1) * this.TAMANO_PAGINA;
    return this.alojamientos().slice(inicio, inicio + this.TAMANO_PAGINA);
  }

  irAPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas()) {
      return;
    }
    this.paginaActual.set(pagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  esFavorito(id: number): boolean {
    return this.favoritosService.esFavorito(id);
  }

  alternarFavorito(id: number, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if (!this.favoritosService.alternar(id)) {
      this.router.navigate(['/login'], { queryParams: { volverA: this.router.url } });
    }
  }

  onImgError(event: Event, id: number): void {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    img.src = `https://picsum.photos/seed/alojamiento-${id}/600/400`;
  }
}
