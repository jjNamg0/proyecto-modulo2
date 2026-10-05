import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map, catchError, of, shareReplay } from 'rxjs';

export type Moneda = 'COP' | 'USD' | 'EUR';

interface RespuestaTasas {
  result: string;
  rates: Record<string, number>;
}

@Injectable({
  providedIn: 'root',
})
export class Exchangerateservice {
  private cliente: HttpClient = inject(HttpClient);
  private readonly URL_BASE: string = 'https://open.er-api.com/v6';

  readonly MONEDAS: Moneda[] = ['COP', 'USD', 'EUR'];

  monedaSeleccionada = signal<Moneda>('COP');
  tasas = signal<Record<string, number> | null>(null);

  private tasasDesdeCop$: Observable<Record<string, number> | null> | null = null;

  obtenerUltimasTasas(monedaBase: string): Observable<HttpResponse<RespuestaTasas>> {
    return this.cliente.get<RespuestaTasas>(`${this.URL_BASE}/latest/${monedaBase}`, {
      observe: 'response',
    });
  }

  cargarTasas(): Observable<Record<string, number> | null> {
    if (!this.tasasDesdeCop$) {
      this.tasasDesdeCop$ = this.obtenerUltimasTasas('COP').pipe(
        map((respuesta) => (respuesta.body?.result === 'success' ? respuesta.body.rates : null)),
        catchError(() => of(null)),
        shareReplay(1),
      );
      this.tasasDesdeCop$.subscribe((tasas) => this.tasas.set(tasas));
    }
    return this.tasasDesdeCop$;
  }

  cambiarMoneda(moneda: Moneda): void {
    if (moneda === 'COP' || this.tasas()) {
      this.monedaSeleccionada.set(moneda);
    }
  }

  convertir(valorEnCop: number): number {
    const moneda = this.monedaSeleccionada();
    const tasa = this.tasas()?.[moneda];
    if (moneda === 'COP' || !tasa) {
      return valorEnCop;
    }
    return valorEnCop * tasa;
  }

  monedaActiva(): Moneda {
    return this.tasas() ? this.monedaSeleccionada() : 'COP';
  }

  formatoDecimales(): string {
    return this.monedaActiva() === 'COP' ? '1.0-0' : '1.2-2';
  }
}
