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

export interface Filtros {
  ciudad: string;
  huespedes: number | null;
  tipo: string;
  precioMaximo: number | null;
}

export const FILTROS_VACIOS: Filtros = {
  ciudad: '',
  huespedes: null,
  tipo: '',
  precioMaximo: null,
};

// la forma completa del json esto lo usa el service nada mas
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

  // el shareReplay es pa no leer el json de nuevo cada vez q alguien llama al servicio
  // se guarda la primera respuesta y ya
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

  // los destacados cambian cada vez q se llama se mezclan los activos y se toman los primeros
  obtenerDestacados(cantidad = 3): Observable<Alojamiento[]> {
    return this.obtenerAlojamientos().pipe(
      map((alojamientos) => {
        const mezclados = [...alojamientos];
        // fisher-yates, el sort con random queda sesgado
        for (let i = mezclados.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [mezclados[i], mezclados[j]] = [mezclados[j], mezclados[i]];
        }
        return mezclados.slice(0, cantidad);
      }),
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

  obtenerCiudades(): Observable<string[]> {
    return this.obtenerAlojamientos().pipe(
      map((alojamientos) => [...new Set(alojamientos.map((a) => a.ciudad))].sort()),
    );
  }

  obtenerTipos(): Observable<string[]> {
    return this.obtenerAlojamientos().pipe(
      map((alojamientos) => [...new Set(alojamientos.map((a) => a.tipo))].sort()),
    );
  }

  filtrar(filtros: Filtros): Observable<Alojamiento[]> {
    return this.obtenerAlojamientos().pipe(
      map((alojamientos) =>
        alojamientos.filter((a) => {
          const coincideCiudad = !filtros.ciudad || a.ciudad === filtros.ciudad;
          const coincideHuespedes = !filtros.huespedes || a.capacidad >= filtros.huespedes;
          const coincideTipo = !filtros.tipo || a.tipo === filtros.tipo;
          const coincidePrecio = !filtros.precioMaximo || a.precioNoche <= filtros.precioMaximo;
          return coincideCiudad && coincideHuespedes && coincideTipo && coincidePrecio;
        }),
      ),
    );
  }
}
