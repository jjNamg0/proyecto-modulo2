import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

export interface Clima {
  temperatura: number;
  sensacion: number;
  humedad: number;
  viento: number;
  descripcion: string;
  icono: string;
}

interface RespuestaOpenMeteo {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
    is_day: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class Climaservice {
  private cliente: HttpClient = inject(HttpClient);
  private readonly URL_BASE: string = 'https://api.open-meteo.com/v1';

  obtenerPronostico(lat: number, lon: number): Observable<HttpResponse<RespuestaOpenMeteo>> {
    const url =
      `${this.URL_BASE}/forecast?latitude=${lat}&longitude=${lon}` +
      '&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day' +
      '&timezone=auto';

    return this.cliente.get<RespuestaOpenMeteo>(url, { observe: 'response' });
  }

  obtenerClima(lat: number, lon: number): Observable<Clima | null> {
    return this.obtenerPronostico(lat, lon).pipe(
      map((respuesta) => {
        const actual = respuesta.body?.current;
        if (!actual) {
          return null;
        }
        const estado = this.interpretarCodigo(actual.weather_code, actual.is_day === 1);
        return {
          temperatura: Math.round(actual.temperature_2m),
          sensacion: Math.round(actual.apparent_temperature),
          humedad: actual.relative_humidity_2m,
          viento: Math.round(actual.wind_speed_10m),
          descripcion: estado.descripcion,
          icono: estado.icono,
        };
      }),
      catchError(() => of(null)),
    );
  }

  private interpretarCodigo(codigo: number, esDeDia: boolean): { descripcion: string; icono: string } {
    if (codigo === 0) {
      return esDeDia
        ? { descripcion: 'Despejado', icono: 'fa-sun' }
        : { descripcion: 'Despejado', icono: 'fa-moon' };
    }
    if (codigo === 1 || codigo === 2) {
      return {
        descripcion: 'Parcialmente nublado',
        icono: esDeDia ? 'fa-cloud-sun' : 'fa-cloud-moon',
      };
    }
    if (codigo === 3) {
      return { descripcion: 'Nublado', icono: 'fa-cloud' };
    }
    if (codigo === 45 || codigo === 48) {
      return { descripcion: 'Niebla', icono: 'fa-smog' };
    }
    if (codigo >= 51 && codigo <= 57) {
      return { descripcion: 'Llovizna', icono: 'fa-cloud-rain' };
    }
    if ((codigo >= 61 && codigo <= 67) || (codigo >= 80 && codigo <= 82)) {
      return { descripcion: 'Lluvia', icono: 'fa-cloud-showers-heavy' };
    }
    if ((codigo >= 71 && codigo <= 77) || codigo === 85 || codigo === 86) {
      return { descripcion: 'Nieve', icono: 'fa-snowflake' };
    }
    if (codigo >= 95) {
      return { descripcion: 'Tormenta eléctrica', icono: 'fa-cloud-bolt' };
    }
    return { descripcion: 'Clima variable', icono: 'fa-cloud' };
  }
}
