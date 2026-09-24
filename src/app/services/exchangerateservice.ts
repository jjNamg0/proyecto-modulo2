import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of, shareReplay } from 'rxjs';

interface RespuestaFrankfurter {
  rates: { EUR: number };
}

@Injectable({
  providedIn: 'root',
})
export class Exchangerateservice {
  private tasaUsdEur$: Observable<number | null> | null = null;

  constructor(private http: HttpClient) {}

  obtenerTasaUsdEur(): Observable<number | null> {
    if (!this.tasaUsdEur$) {
      this.tasaUsdEur$ = this.http
        .get<RespuestaFrankfurter>('https://api.frankfurter.dev/v1/latest?base=USD&symbols=EUR')
        .pipe(
          map((respuesta) => respuesta.rates.EUR),
          catchError(() => of(null)),
          shareReplay(1),
        );
    }
    return this.tasaUsdEur$;
  }
}
