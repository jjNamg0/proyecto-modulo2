import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map, catchError, of, shareReplay } from 'rxjs';

interface RespuestaFrankfurter {
  rates: { EUR: number };
}

@Injectable({
  providedIn: 'root',
})
export class Exchangerateservice {
  private cliente: HttpClient = inject(HttpClient);
  private readonly URL_BASE: string = 'https://api.frankfurter.dev/v1';

  private tasaUsdEur$: Observable<number | null> | null = null;

  obtenerUltimasTasas(): Observable<HttpResponse<RespuestaFrankfurter>> {
    return this.cliente.get<RespuestaFrankfurter>(`${this.URL_BASE}/latest?base=USD&symbols=EUR`, {
      observe: 'response',
    });
  }

  obtenerTasaUsdEur(): Observable<number | null> {
    if (!this.tasaUsdEur$) {
      this.tasaUsdEur$ = this.obtenerUltimasTasas().pipe(
        map((respuesta) => respuesta.body?.rates.EUR ?? null),
        catchError(() => of(null)),
        shareReplay(1),
      );
    }
    return this.tasaUsdEur$;
  }
}
