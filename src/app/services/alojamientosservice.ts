import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';

export interface Alojamiento {
  id: number;
  nombre: string;
  descripcion: string;
  ciudad: string;
  pais: string;
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
  publicadoPor?: string;
}

export type DatosNuevoAlojamiento = Omit<Alojamiento, 'id' | 'activo' | 'calificacion'>;

export interface Resena {
  id: number;
  alojamientoId: number;
  usuario: string;
  calificacion: number;
  comentario: string;
}

export interface Filtros {
  texto: string;
  pais: string;
  ciudad: string;
  huespedes: number | null;
  tipo: string;
  precioMaximo: number | null;
  orden: string;
}

export const FILTROS_VACIOS: Filtros = {
  texto: '',
  pais: '',
  ciudad: '',
  huespedes: null,
  tipo: '',
  precioMaximo: null,
  orden: '',
};

interface MarketplaceData {
  alojamientos: Alojamiento[];
  resenas: Resena[];
}

@Injectable({
  providedIn: 'root',
})
export class Alojamientosservice {
  private datos$: Observable<MarketplaceData> | null = null;

  private resenasAgregadas: Resena[] = [];
  private siguienteIdLocal = -1;

  private alojamientosAgregados: Alojamiento[] = [];
  private siguienteIdAlojamiento = 1000;

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
      map((datos) =>
        [...datos.alojamientos, ...this.alojamientosAgregados]
          .filter((a) => a.activo && a.precioNoche > 0)
          .map((a) => this.conCalificacionActualizada(a, datos.resenas)),
      ),
    );
  }

  agregarAlojamiento(datos: DatosNuevoAlojamiento): Alojamiento {
    const alojamiento: Alojamiento = {
      ...datos,
      id: this.siguienteIdAlojamiento++,
      activo: true,
      calificacion: 0,
    };
    this.alojamientosAgregados.push(alojamiento);
    return alojamiento;
  }

  obtenerServiciosComunes(cantidad: number): Observable<string[]> {
    return this.obtenerAlojamientos().pipe(
      map((alojamientos) => {
        const conteo = new Map<string, number>();
        alojamientos.forEach((a) => a.servicios.forEach((s) => conteo.set(s, (conteo.get(s) ?? 0) + 1)));
        return [...conteo.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, cantidad)
          .map(([servicio]) => servicio);
      }),
    );
  }

  obtenerDestacados(cantidad = 3): Observable<Alojamiento[]> {
    return this.obtenerAlojamientos().pipe(
      map((alojamientos) => {
        const mezclados = [...alojamientos];
        for (let i = mezclados.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [mezclados[i], mezclados[j]] = [mezclados[j], mezclados[i]];
        }
        return mezclados.slice(0, cantidad);
      }),
    );
  }

  obtenerPorId(id: number): Observable<Alojamiento | undefined> {
    return this.obtenerAlojamientos().pipe(map((alojamientos) => alojamientos.find((a) => a.id === id)));
  }

  obtenerResenasPorAlojamiento(alojamientoId: number): Observable<Resena[]> {
    return this.cargarDatos().pipe(
      map((datos) => [
        ...datos.resenas.filter((r) => r.alojamientoId === alojamientoId),
        ...this.resenasAgregadas.filter((r) => r.alojamientoId === alojamientoId),
      ]),
    );
  }

  agregarResena(datos: Omit<Resena, 'id'>): Resena {
    const resena: Resena = { ...datos, id: this.siguienteIdLocal-- };
    this.resenasAgregadas.push(resena);
    return resena;
  }

  obtenerPaises(): Observable<string[]> {
    return this.obtenerAlojamientos().pipe(
      map((alojamientos) =>
        [...new Set(alojamientos.map((a) => a.pais))].sort((a, b) => a.localeCompare(b, 'es')),
      ),
    );
  }

  obtenerCiudades(pais = ''): Observable<string[]> {
    return this.obtenerAlojamientos().pipe(
      map((alojamientos) =>
        [...new Set(alojamientos.filter((a) => !pais || a.pais === pais).map((a) => a.ciudad))].sort(
          (a, b) => a.localeCompare(b, 'es'),
        ),
      ),
    );
  }

  obtenerTipos(): Observable<string[]> {
    return this.obtenerAlojamientos().pipe(
      map((alojamientos) => [...new Set(alojamientos.map((a) => a.tipo))].sort()),
    );
  }

  filtrar(filtros: Filtros): Observable<Alojamiento[]> {
    const textoBuscado = this.normalizar(filtros.texto.trim());

    return this.obtenerAlojamientos().pipe(
      map((alojamientos) =>
        this.ordenar(alojamientos, filtros.orden).filter((a) => {
          const coincideTexto = !textoBuscado || this.textoDeBusqueda(a).includes(textoBuscado);
          const coincidePais = !filtros.pais || a.pais === filtros.pais;
          const coincideCiudad = !filtros.ciudad || a.ciudad === filtros.ciudad;
          const coincideHuespedes = !filtros.huespedes || a.capacidad >= filtros.huespedes;
          const coincideTipo = !filtros.tipo || a.tipo === filtros.tipo;
          const coincidePrecio = !filtros.precioMaximo || a.precioNoche <= filtros.precioMaximo;
          return (
            coincideTexto && coincidePais && coincideCiudad && coincideHuespedes && coincideTipo && coincidePrecio
          );
        }),
      ),
    );
  }

  private ordenar(alojamientos: Alojamiento[], orden: string): Alojamiento[] {
    const copia = [...alojamientos];

    if (orden === 'precio-asc') {
      return copia.sort((a, b) => a.precioNoche - b.precioNoche);
    }
    if (orden === 'precio-desc') {
      return copia.sort((a, b) => b.precioNoche - a.precioNoche);
    }
    if (orden === 'calificacion-desc') {
      return copia.sort((a, b) => b.calificacion - a.calificacion);
    }
    if (orden === 'nombre-asc') {
      return copia.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    }
    return copia;
  }

  private conCalificacionActualizada(a: Alojamiento, resenasDelJson: Resena[]): Alojamiento {
    const nuevas = this.resenasAgregadas.filter((r) => r.alojamientoId === a.id);
    if (nuevas.length === 0) {
      return a;
    }

    const cantidadBase =
      a.calificacion > 0 ? Math.max(1, resenasDelJson.filter((r) => r.alojamientoId === a.id).length) : 0;
    const sumaNuevas = nuevas.reduce((total, r) => total + r.calificacion, 0);
    const promedio = (a.calificacion * cantidadBase + sumaNuevas) / (cantidadBase + nuevas.length);

    return { ...a, calificacion: Math.round(promedio * 10) / 10 };
  }

  private textoDeBusqueda(a: Alojamiento): string {
    return this.normalizar(
      [a.nombre, a.ciudad, a.pais, a.ubicacion, a.tipo, a.descripcion, ...a.servicios].join(' '),
    );
  }

  private normalizar(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
