import { Component, OnInit, signal } from '@angular/core';
import { Alojamientosservice, Alojamiento } from '../../services/alojamientosservice';

@Component({
  selector: 'app-homecomponent',
  standalone: false,
  styleUrl: './homecomponent.css',
  templateUrl: './homecomponent.html',
})
export class Homecomponent implements OnInit {
  destacados = signal<Alojamiento[]>([]);

  constructor(private alojamientosService: Alojamientosservice) {}

  ngOnInit(): void {
    // trae 3 alojamientos al azar pa mostrar en el inicio cambian cada vez q se entra
    this.alojamientosService.obtenerDestacados(3).subscribe((alojamientos) => {
      this.destacados.set(alojamientos);
    });
  }

  onImgError(event: Event, id: number): void {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    img.src = `https://picsum.photos/seed/alojamiento-${id}/600/400`;
  }
}
