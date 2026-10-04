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

export interface DiaPronostico {
  fecha: string;
  etiqueta: string;
  maxima: number;
  minima: number;
  probabilidadLluvia: number;
  descripcion: string;
  icono: string;
}

export type TipoVeredicto = 'bueno' | 'mixto' | 'lluvia' | 'frio' | 'calor';

export interface PronosticoEstancia {
  dias: DiaPronostico[];
  veredicto: string;
  tipoVeredicto: TipoVeredicto;
  iconoVeredicto: string;
  incompleto: boolean;
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

interface RespuestaDiariaOpenMeteo {
  daily: {
    time: string[];
    weather_code: (number | null)[];
    temperature_2m_max: (number | null)[];
    temperature_2m_min: (number | null)[];
    precipitation_probability_max: (number | null)[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class Climaservice {
  private cliente: HttpClient = inject(HttpClient);
  private readonly URL_BASE: string = 'https://api.open-meteo.com/v1';
  private readonly DIAS_DE_PRONOSTICO = 16;

  obtenerPronosticoDiario(
    lat: number,
    lon: number,
    fechaInicio: string,
    fechaFin: string,
  ): Observable<HttpResponse<RespuestaDiariaOpenMeteo>> {
    const url =
      `${this.URL_BASE}/forecast?latitude=${lat}&longitude=${lon}` +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
      `&timezone=auto&start_date=${fechaInicio}&end_date=${fechaFin}`;

    return this.cliente.get<RespuestaDiariaOpenMeteo>(url, { observe: 'response' });
  }

  fechaLimitePronostico(): string {
    const limite = new Date();
    limite.setDate(limite.getDate() + this.DIAS_DE_PRONOSTICO - 1);
    return this.formatearFecha(limite);
  }

  obtenerPronosticoEstancia(
    lat: number,
    lon: number,
    fechaInicio: string,
    fechaFin: string,
  ): Observable<PronosticoEstancia | null> {
    const limite = this.fechaLimitePronostico();
    if (fechaInicio > limite) {
      return of(null);
    }

    const finConsultado = fechaFin > limite ? limite : fechaFin;

    return this.obtenerPronosticoDiario(lat, lon, fechaInicio, finConsultado).pipe(
      map((respuesta) => {
        const diario = respuesta.body?.daily;
        if (!diario || diario.time.length === 0) {
          return null;
        }

        const dias: DiaPronostico[] = [];
        diario.time.forEach((fecha, i) => {
          const codigo = diario.weather_code[i];
          const maxima = diario.temperature_2m_max[i];
          const minima = diario.temperature_2m_min[i];
          if (codigo === null || maxima === null || minima === null) {
            return;
          }

          const estado = this.interpretarCodigo(codigo, true);
          dias.push({
            fecha,
            etiqueta: `${fecha.slice(8, 10)}/${fecha.slice(5, 7)}`,
            maxima: Math.round(maxima),
            minima: Math.round(minima),
            probabilidadLluvia: diario.precipitation_probability_max[i] ?? 0,
            descripcion: estado.descripcion,
            icono: estado.icono,
          });
        });

        if (dias.length === 0) {
          return null;
        }

        const incompleto = finConsultado < fechaFin || dias.length < diario.time.length;
        return { dias, ...this.calcularVeredicto(dias), incompleto };
      }),
      catchError(() => of(null)),
    );
  }

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

  private calcularVeredicto(
    dias: DiaPronostico[],
  ): { veredicto: string; tipoVeredicto: TipoVeredicto; iconoVeredicto: string } {
    const diasConLluvia = dias.filter((d) => d.probabilidadLluvia >= 60).length;
    const maximaPromedio = dias.reduce((total, d) => total + d.maxima, 0) / dias.length;

    if (diasConLluvia >= Math.ceil(dias.length / 2)) {
      return {
        veredicto: 'Lluvia probable la mayoría de los días. Lleva paraguas o planes bajo techo.',
        tipoVeredicto: 'lluvia',
        iconoVeredicto: 'fa-umbrella',
      };
    }
    if (maximaPromedio < 14) {
      return {
        veredicto: 'Va a hacer frío. Lleva ropa abrigada.',
        tipoVeredicto: 'frio',
        iconoVeredicto: 'fa-temperature-low',
      };
    }
    if (maximaPromedio > 32) {
      return {
        veredicto: 'Va a hacer mucho calor. Lleva bloqueador y mantente hidratado.',
        tipoVeredicto: 'calor',
        iconoVeredicto: 'fa-temperature-high',
      };
    }
    if (diasConLluvia > 0) {
      return {
        veredicto: 'Buen clima en general, con algún día de posible lluvia.',
        tipoVeredicto: 'mixto',
        iconoVeredicto: 'fa-cloud-sun-rain',
      };
    }
    return {
      veredicto: 'Buen clima para tu estancia.',
      tipoVeredicto: 'bueno',
      iconoVeredicto: 'fa-sun',
    };
  }

  private formatearFecha(fecha: Date): string {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
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
