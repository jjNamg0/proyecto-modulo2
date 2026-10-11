import { Component } from '@angular/core';

export interface SeccionLegal {
  id: string;
  titulo: string;
  icono: string;
  parrafos: string[];
  puntos?: string[];
}

@Component({
  selector: 'app-terminoscomponent',
  standalone: false,
  styleUrl: './terminoscomponent.css',
  templateUrl: './terminoscomponent.html',
})
export class Terminoscomponent {
  readonly ACTUALIZACION = 'octubre de 2026';

  readonly SECCIONES: SeccionLegal[] = [
    {
      id: 'terminos-sobre',
      titulo: 'Sobre Nocturna Stays',
      icono: 'fa-circle-info',
      parrafos: [
        'Nocturna Stays es un marketplace de alojamientos temporales hecho como proyecto académico de la Universidad El Bosque. Al usar la página aceptas estos términos.',
        'Es una demostración: los pagos son simulados y ninguna reserva genera cobros ni compromisos reales con los alojamientos.',
      ],
    },
    {
      id: 'terminos-cuenta',
      titulo: 'Tu cuenta',
      icono: 'fa-user',
      parrafos: ['Algunas funciones necesitan una cuenta. Al crearla te comprometes a dar datos reales y a cuidar tu contraseña.'],
      puntos: [
        'Cada correo solo puede tener una cuenta y no se puede cambiar después, porque identifica tus reservas.',
        'La contraseña debe tener mínimo 4 caracteres.',
        'Todo lo que pase desde tu cuenta es tu responsabilidad.',
      ],
    },
    {
      id: 'terminos-reservas',
      titulo: 'Reservas y pagos',
      icono: 'fa-calendar-check',
      parrafos: ['Para reservar necesitas sesión iniciada y una cotización válida. La cotización cumple estas reglas:'],
      puntos: [
        'La fecha de llegada no puede ser anterior a hoy y la de salida debe ser posterior a la de llegada.',
        'Los huéspedes van de 1 hasta la capacidad del alojamiento.',
        'No se pueden reservar fechas que ya estén ocupadas.',
        'Al precio de las noches se le suma la tarifa de limpieza y una tarifa de servicio del 10%.',
        'El pago siempre se cobra en pesos colombianos, aunque veas el precio en otra moneda.',
      ],
    },
    {
      id: 'terminos-cancelaciones',
      titulo: 'Cancelaciones',
      icono: 'fa-ban',
      parrafos: [
        'Puedes cancelar una reserva confirmada desde Mis reservas. Al cancelarla, sus fechas quedan libres otra vez para cualquier persona.',
        'El comprobante de una reserva cancelada se sigue pudiendo consultar, pero aparece con el estado CANCELADA.',
      ],
    },
    {
      id: 'terminos-cupones',
      titulo: 'Cupones de descuento',
      icono: 'fa-ticket',
      parrafos: ['Los cupones se escriben en el panel de pago antes de pagar.'],
      puntos: [
        'Solo se puede usar un cupón por reserva.',
        'El descuento se aplica sobre el valor de las noches, no sobre la limpieza ni la tarifa de servicio.',
        'Cada cupón tiene fecha de vencimiento y algunos piden un mínimo de noches.',
        'Si cambias las fechas y la estancia ya no cumple las condiciones del cupón, se quita solo.',
      ],
    },
    {
      id: 'terminos-publicar',
      titulo: 'Publicar alojamientos',
      icono: 'fa-house-user',
      parrafos: ['Cualquier persona con sesión puede publicar su alojamiento.'],
      puntos: [
        'La información publicada debe ser real y la foto se agrega con un enlace http o https.',
        'Solo puedes editar, desactivar o volver a activar los alojamientos que publicaste tú.',
        'Un alojamiento desactivado deja de aparecer en el listado.',
      ],
    },
    {
      id: 'terminos-resenas',
      titulo: 'Reseñas',
      icono: 'fa-star',
      parrafos: [
        'Para dejar una reseña necesitas sesión. La calificación va de 1 a 5 estrellas y actualiza la calificación del alojamiento.',
        'Las reseñas deben ser respetuosas y hablar de la experiencia en el alojamiento.',
      ],
    },
    {
      id: 'terminos-terceros',
      titulo: 'Información de terceros e IA',
      icono: 'fa-robot',
      parrafos: [
        'El clima, el pronóstico, las tasas de cambio, los festivos y los datos del país vienen de servicios externos. Pueden fallar o no ser exactos; si fallan, esa parte simplemente no se muestra.',
        'La opinión de la IA (Gemini) es solo una orientación. La decisión de reservar es tuya, y el uso de tu API key de Gemini corre por tu cuenta.',
      ],
    },
    {
      id: 'terminos-cambios',
      titulo: 'Cambios en estos términos',
      icono: 'fa-pen-to-square',
      parrafos: [
        'Podemos actualizar estos términos cuando la plataforma tenga funciones nuevas. Arriba siempre verás la fecha de la última actualización.',
      ],
    },
  ];

  irASeccion(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
