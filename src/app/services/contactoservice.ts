import { Injectable } from '@angular/core';
import { Notificacionservice } from './notificacionservice';

export interface SolicitudContacto {
  id: number;
  nombre: string;
  cuenta: string | null;
  asunto: string;
  reservaId: number | null;
  mensaje: string;
  fecha: Date;
}

export type DatosContacto = Omit<SolicitudContacto, 'id' | 'fecha'>;

@Injectable({
  providedIn: 'root',
})
export class Contactoservice {
  readonly ASUNTOS = [
    'Consulta general',
    'Problema con una reserva',
    'Problema con un pago',
    'Publicar mi alojamiento',
    'Reportar un error de la página',
    'Otro',
  ];

  readonly ASUNTOS_CON_RESERVA = ['Problema con una reserva', 'Problema con un pago'];

  private solicitudes: SolicitudContacto[] = [];
  private siguienteId = 1;

  constructor(private notificacionService: Notificacionservice) {}

  enviar(datos: DatosContacto): SolicitudContacto {
    const solicitud: SolicitudContacto = {
      ...datos,
      id: this.siguienteId++,
      fecha: new Date(),
    };

    this.solicitudes.push(solicitud);
    this.notificacionService.agregar(`Recibimos tu solicitud #${solicitud.id} sobre "${solicitud.asunto}".`);
    return solicitud;
  }

  obtenerSolicitudesDe(cuenta: string): SolicitudContacto[] {
    return this.solicitudes.filter((s) => s.cuenta === cuenta).sort((a, b) => b.id - a.id);
  }
}
