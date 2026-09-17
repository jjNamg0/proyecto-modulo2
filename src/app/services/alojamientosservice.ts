import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';

export interface Alojamiento {
  id: number;
  nombre: string;
  descripcion: string;
  ciudad: string;
  ubicacion: string;
  tipo: string;
  capacidad: number;
  habitaciones: number;
  camas: number;
  banos: number;
  precioNoche: number;
  tarifaLimpieza: number;
  calificacion: number;
  activo: boolean;
  imagenPrincipal: string;
  imagenes: string[];
  servicios: string[];
  reglas: string[];
}

export interface Resena {
  id: number;
  alojamientoId: number;
  usuario: string;
  calificacion: number;
  comentario: string;
}

interface MarketplaceData {
  alojamientos: Alojamiento[];
  resenas: Resena[];
}

@Injectable({
  providedIn: 'root',
})
export class Alojamientosservice {
  private datos$: Observable<MarketplaceData> | null = null;

  constructor(private http: HttpClient) {}

  private cargarDatos(): Observable<MarketplaceData> {
    if (!this.datos$) {
      this.datos$ = this.http
        .get<MarketplaceData>('assets/data/marketplace-data.json')
        .pipe(shareReplay(1));
    }
    return this.datos$;
  }

  obtenerAlojamientos(): Observable<Alojamiento[]> {
    return this.cargarDatos().pipe(
      map((datos) => datos.alojamientos.filter((a) => a.activo)),
    );
  }

  obtenerDestacados(cantidad = 3): Observable<Alojamiento[]> {
    return this.obtenerAlojamientos().pipe(
      map((alojamientos) =>
        [...alojamientos].sort((a, b) => b.calificacion - a.calificacion).slice(0, cantidad),
      ),
    );
  }

  obtenerPorId(id: number): Observable<Alojamiento | undefined> {
    return this.cargarDatos().pipe(
      map((datos) => datos.alojamientos.find((a) => a.id === id && a.activo)),
    );
  }

  obtenerResenasPorAlojamiento(alojamientoId: number): Observable<Resena[]> {
    return this.cargarDatos().pipe(
      map((datos) => datos.resenas.filter((r) => r.alojamientoId === alojamientoId)),
    );
  }
}
