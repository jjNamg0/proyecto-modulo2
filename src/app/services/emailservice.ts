import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

export interface DatosConfirmacion {
  to_email: string;
  to_name: string;
  alojamiento: string;
  fecha_entrada: string;
  fecha_salida: string;
  valor: string;
}

@Injectable({
  providedIn: 'root',
})
export class Emailservice {
  private readonly serviceId = 'service_f5wbz52';
  private readonly templateId = 'template_h3s78zl';
  private readonly publicKey = 'c_ohAoJRsWFtTEGc-';

  enviarConfirmacion(
    datos: DatosConfirmacion
  ): Promise<unknown> {
    const parametros: Record<string, unknown> = {
      to_email: datos.to_email,
      to_name: datos.to_name,
      alojamiento: datos.alojamiento,
      fecha_entrada: datos.fecha_entrada,
      fecha_salida: datos.fecha_salida,
      valor: datos.valor,
    };

    return emailjs.send(
      this.serviceId,
      this.templateId,
      parametros as Record<string, string>,
      {
        publicKey: this.publicKey,
      }
    );
  }
}
