import { Component, OnInit, signal } from '@angular/core';
import { Alojamientosservice, Alojamiento } from '../../services/alojamientosservice';
import { Favoritosservice } from '../../services/favoritosservice';

@Component({
  selector: 'app-favoritoscomponent',
  standalone: false,
  styleUrl: './favoritoscomponent.css',
  templateUrl: './favoritoscomponent.html',
})
export class Favoritoscomponent implements OnInit {
  favoritos = signal<Alojamiento[]>([]);
  cargando = signal(true);

  constructor(
    private alojamientosService: Alojamientosservice,
    private favoritosService: Favoritosservice,
  ) {}

  ngOnInit(): void {
    const idsFavoritos = this.favoritosService.obtenerIds();
    this.alojamientosService.obtenerAlojamientos().subscribe((alojamientos) => {
      this.favoritos.set(alojamientos.filter((a) => idsFavoritos.includes(a.id)));
      this.cargando.set(false);
    });
  }

  quitarFavorito(id: number): void {
    this.favoritosService.alternar(id);
    this.favoritos.update((lista) => lista.filter((a) => a.id !== id));
  }

  onImgError(event: Event): void {
    this.alojamientosService.usarImagenRespaldo(event);
  }
}
