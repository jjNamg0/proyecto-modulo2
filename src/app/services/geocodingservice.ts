import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  private apiKey = '6a985c659026e977256665fgk8cfe67';

  constructor(private http: HttpClient) {}

  // si la api falla el detalle simplemente no muestra el link del mapa
  obtenerCoordenadas(direccion: string): Observable<Coordenadas | null> {
    const url = `https://geocode.maps.co/search?q=${encodeURIComponent(direccion)}&api_key=${this.apiKey}`;

    return this.http.get<ResultadoGeocode[]>(url).pipe(
      map((resultados) => {
        if (!resultados || resultados.length === 0) {
          return null;
        }
        return { lat: Number(resultados[0].lat), lon: Number(resultados[0].lon) };
      }),
      catchError(() => of(null)),
    );
  }
}
