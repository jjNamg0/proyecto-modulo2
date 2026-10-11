import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

export interface DatosConfirmacion {
  correo: string;
  nombre: string;
  alojamiento: string;
  fechaEntrada: string;
  fechaSalida: string;
  valor: string;
}

@Injectable({
  providedIn: 'root',
})
export class Emailservice {
  private cliente: HttpClient = inject(HttpClient);
  private readonly URL_BASE: string = 'https://api.emailjs.com/api/v1.0';
  private readonly SERVICE_ID = 'service_f5wbz52';
  private readonly TEMPLATE_ID = 'template_h3s78zl';
  private readonly PUBLIC_KEY = 'c_ohAoJRsWFtTEGc-';

  enviarCorreo(cuerpo: object): Observable<HttpResponse<string>> {
    return this.cliente.post(`${this.URL_BASE}/email/send`, cuerpo, {
      observe: 'response',
      responseType: 'text',
    });
  }

  enviarConfirmacion(datos: DatosConfirmacion): Observable<boolean> {
    const cuerpo = {
      service_id: this.SERVICE_ID,
      template_id: this.TEMPLATE_ID,
      user_id: this.PUBLIC_KEY,
      template_params: {
        to_email: datos.correo,
        to_name: datos.nombre,
        alojamiento: datos.alojamiento,
        fecha_entrada: datos.fechaEntrada,
        fecha_salida: datos.fechaSalida,
        valor: datos.valor,
      },
    };

    return this.enviarCorreo(cuerpo).pipe(
      map((respuesta) => respuesta.ok),
      catchError(() => of(false)),
    );
  }
}
