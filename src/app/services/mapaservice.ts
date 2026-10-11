import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

export interface MundoTopologia {
  type: string;
  arcs: number[][][];
  objects: { countries: object };
}

@Injectable({
  providedIn: 'root',
})
export class Mapaservice {
  private cliente: HttpClient = inject(HttpClient);
  private readonly URL_BASE: string = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2';

  obtenerPaisesDelMundo(): Observable<HttpResponse<MundoTopologia>> {
    return this.cliente.get<MundoTopologia>(`${this.URL_BASE}/countries-110m.json`, {
      observe: 'response',
    });
  }

  obtenerMundo(): Observable<MundoTopologia | null> {
    return this.obtenerPaisesDelMundo().pipe(
      map((respuesta) => respuesta.body),
      catchError(() => of(null)),
    );
  }
}
