import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

export interface Coordenadas {
  lat: number;
  lon: number;
}

interface ResultadoGeocode {
  lat: string;
  lon: string;
}

@Injectable({
  providedIn: 'root',
})
export class Geocodingservice {
  private cliente: HttpClient = inject(HttpClient);
  private readonly URL_BASE: string = 'https://geocode.maps.co';
  private readonly API_KEY: string = '6a985c659026e977256665fgk8cfe67';

  buscarDireccion(direccion: string): Observable<HttpResponse<ResultadoGeocode[]>> {
    return this.cliente.get<ResultadoGeocode[]>(
      `${this.URL_BASE}/search?q=${encodeURIComponent(direccion)}&api_key=${this.API_KEY}`,
      { observe: 'response' },
    );
  }

  obtenerCoordenadas(direccion: string): Observable<Coordenadas | null> {
    return this.buscarDireccion(direccion).pipe(
      map((respuesta) => {
        const resultados = respuesta.body;
        if (!resultados || resultados.length === 0) {
          return null;
        }
        return { lat: Number(resultados[0].lat), lon: Number(resultados[0].lon) };
      }),
      catchError(() => of(null)),
    );
  }
}
