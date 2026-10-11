import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

export type Idioma = 'es' | 'en' | 'pt' | 'ja';

export interface OpcionIdioma {
  codigo: Idioma;
  nombre: string;
}

interface ArchivoTraduccion {
  [clave: string]: string | ArchivoTraduccion;
}

type Diccionario = Record<string, string>;

@Injectable({
  providedIn: 'root',
})
export class Idiomaservice {
  readonly IDIOMAS: OpcionIdioma[] = [
    { codigo: 'es', nombre: 'Español' },
    { codigo: 'en', nombre: 'English' },
    { codigo: 'pt', nombre: 'Português' },
    { codigo: 'ja', nombre: '日本語' },
  ];

  private readonly IDIOMA_RESPALDO: Idioma = 'es';

  idiomaActual = signal<Idioma>('es');
  private diccionarios = signal<Partial<Record<Idioma, Diccionario>>>({});

  constructor(private http: HttpClient) {
    this.cargarIdioma(this.IDIOMA_RESPALDO);
  }

  cambiarIdioma(idioma: Idioma): void {
    this.idiomaActual.set(idioma);
    document.documentElement.lang = idioma;
    this.cargarIdioma(idioma);
  }

  traducir(clave: string, parametros: Record<string, string | number> = {}): string {
    const texto =
      this.diccionarios()[this.idiomaActual()]?.[clave] ?? this.diccionarios()[this.IDIOMA_RESPALDO]?.[clave] ?? '';

    return Object.entries(parametros).reduce(
      (resultado, [nombre, valor]) => resultado.replaceAll(`{{${nombre}}}`, String(valor)),
      texto,
    );
  }

  private cargarIdioma(idioma: Idioma): void {
    if (this.diccionarios()[idioma]) {
      return;
    }

    this.http
      .get<ArchivoTraduccion>(`assets/i18n/${idioma}.json`)
      .pipe(
        map((archivo) => this.aplanar(archivo)),
        catchError(() => of(null)),
      )
      .subscribe((diccionario) => {
        if (diccionario) {
          this.diccionarios.update((actuales) => ({ ...actuales, [idioma]: diccionario }));
        }
      });
  }

  private aplanar(archivo: ArchivoTraduccion, prefijo = ''): Diccionario {
    let diccionario: Diccionario = {};
    for (const [clave, valor] of Object.entries(archivo)) {
      if (typeof valor === 'string') {
        diccionario[prefijo + clave] = valor;
      } else {
        diccionario = { ...diccionario, ...this.aplanar(valor, `${prefijo}${clave}.`) };
      }
    }
    return diccionario;
  }
}
