import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of, shareReplay, switchMap } from 'rxjs';

export interface DatosPais {
  codigo: string;
  nombre: string;
  region: string;
  vecinos: string[];
  bandera: string;
}

export interface Festivo {
  fecha: string;
  etiqueta: string;
  nombre: string;
}

interface PaisDisponible {
  countryCode: string;
  name: string;
}

interface RespuestaInfoPais {
  countryCode: string;
  region: string;
  borders: { countryCode: string }[] | null;
}

interface RespuestaFestivo {
  date: string;
  localName: string;
  global: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class Paisesservice {
  private cliente: HttpClient = inject(HttpClient);
  private readonly URL_BASE: string = 'https://date.nager.at/api/v3';
  private readonly URL_BANDERAS: string = 'https://flagcdn.com';

  private readonly REGIONES: Record<string, string> = {
    Americas: 'América',
    Europe: 'Europa',
    Asia: 'Asia',
    Africa: 'África',
    Oceania: 'Oceanía',
  };

  private nombresEnEspanol = new Intl.DisplayNames(['es'], { type: 'region' });
  private codigosPorNombre$: Observable<Record<string, string>> | null = null;

  obtenerPaisesDisponibles(): Observable<HttpResponse<PaisDisponible[]>> {
    return this.cliente.get<PaisDisponible[]>(`${this.URL_BASE}/AvailableCountries`, { observe: 'response' });
  }

  obtenerInfoPais(codigo: string): Observable<HttpResponse<RespuestaInfoPais>> {
    return this.cliente.get<RespuestaInfoPais>(`${this.URL_BASE}/CountryInfo/${codigo}`, { observe: 'response' });
  }

  obtenerFestivosDelAnio(anio: number, codigo: string): Observable<HttpResponse<RespuestaFestivo[]>> {
    return this.cliente.get<RespuestaFestivo[]>(`${this.URL_BASE}/PublicHolidays/${anio}/${codigo}`, {
      observe: 'response',
    });
  }

  urlBandera(codigo: string): string {
    return `${this.URL_BANDERAS}/w80/${codigo.toLowerCase()}.png`;
  }

  codigoDe(pais: string): Observable<string | null> {
    return this.cargarCodigos().pipe(map((codigos) => codigos[this.normalizar(pais)] ?? null));
  }

  obtenerDatosPais(pais: string): Observable<DatosPais | null> {
    return this.codigoDe(pais).pipe(
      switchMap((codigo) => {
        if (!codigo) {
          return of(null);
        }
        return this.obtenerInfoPais(codigo).pipe(
          map((respuesta) => {
            const info = respuesta.body;
            if (!info) {
              return null;
            }
            return {
              codigo,
              nombre: this.nombreEnEspanol(codigo),
              region: this.REGIONES[info.region] ?? info.region,
              vecinos: (info.borders ?? []).map((vecino) => this.nombreEnEspanol(vecino.countryCode)),
              bandera: this.urlBandera(codigo),
            };
          }),
        );
      }),
      catchError(() => of(null)),
    );
  }

  obtenerFestivosEnEstancia(pais: string, fechaInicio: string, fechaFin: string): Observable<Festivo[]> {
    const anioInicio = Number(fechaInicio.slice(0, 4));
    const anioFin = Number(fechaFin.slice(0, 4));
    const anios = Array.from({ length: anioFin - anioInicio + 1 }, (_, i) => anioInicio + i);

    return this.codigoDe(pais).pipe(
      switchMap((codigo) => {
        if (!codigo) {
          return of([]);
        }
        return forkJoin(anios.map((anio) => this.obtenerFestivosDelAnio(anio, codigo))).pipe(
          map((respuestas) =>
            respuestas
              .flatMap((respuesta) => respuesta.body ?? [])
              .filter((festivo) => festivo.global && festivo.date >= fechaInicio && festivo.date <= fechaFin)
              .map((festivo) => ({
                fecha: festivo.date,
                etiqueta: `${festivo.date.slice(8, 10)}/${festivo.date.slice(5, 7)}`,
                nombre: festivo.localName,
              })),
          ),
        );
      }),
      catchError(() => of([])),
    );
  }

  private cargarCodigos(): Observable<Record<string, string>> {
    if (!this.codigosPorNombre$) {
      this.codigosPorNombre$ = this.obtenerPaisesDisponibles().pipe(
        map((respuesta) => {
          const codigos: Record<string, string> = {};
          (respuesta.body ?? []).forEach((pais) => {
            codigos[this.normalizar(this.nombreEnEspanol(pais.countryCode))] = pais.countryCode;
          });
          return codigos;
        }),
        catchError(() => of({})),
        shareReplay(1),
      );
    }
    return this.codigosPorNombre$;
  }

  private nombreEnEspanol(codigo: string): string {
    return this.nombresEnEspanol.of(codigo) ?? codigo;
  }

  private normalizar(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}
