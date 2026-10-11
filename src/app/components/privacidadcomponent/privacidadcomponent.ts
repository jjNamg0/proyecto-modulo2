import { Component } from '@angular/core';
import { SeccionLegal } from '../terminoscomponent/terminoscomponent';

@Component({
  selector: 'app-privacidadcomponent',
  standalone: false,
  styleUrl: './privacidadcomponent.css',
  templateUrl: './privacidadcomponent.html',
})
export class Privacidadcomponent {
  readonly ACTUALIZACION = 'octubre de 2026';

  readonly SECCIONES: SeccionLegal[] = [
    {
      id: 'privacidad-datos',
      titulo: 'Qué datos pedimos',
      icono: 'fa-id-card',
      parrafos: ['Solo pedimos lo necesario para que cada función sirva:'],
      puntos: [
        'Nombre, correo y contraseña cuando creas tu cuenta.',
        'Datos de la tarjeta cuando pagas una reserva.',
        'Fechas y número de huéspedes de tus reservas.',
        'Las reseñas y los alojamientos que publiques.',
        'Los mensajes que nos mandes desde Contacto.',
      ],
    },
    {
      id: 'privacidad-almacenamiento',
      titulo: 'Dónde se guardan',
      icono: 'fa-memory',
      parrafos: [
        'Todo vive en la memoria del navegador mientras la página está abierta. No hay servidor ni base de datos detrás.',
        'Al recargar o cerrar la pestaña se borra todo: cuenta, reservas, favoritos y notificaciones. Tampoco usamos cookies ni almacenamiento local.',
      ],
    },
    {
      id: 'privacidad-tarjeta',
      titulo: 'Datos de la tarjeta',
      icono: 'fa-credit-card',
      parrafos: [
        'El pago es simulado. Solo revisamos que el número tenga 16 dígitos, el vencimiento el formato MM/AA y el CVV 3 dígitos.',
        'Los datos de la tarjeta no se guardan ni se mandan a ningún lado: se borran del formulario apenas confirmas el pago, y el comprobante no los muestra.',
      ],
    },
    {
      id: 'privacidad-servicios',
      titulo: 'Servicios externos',
      icono: 'fa-globe',
      parrafos: ['Para mostrar información extra consultamos estos servicios. Ninguno recibe tu nombre, tu correo ni tu contraseña:'],
      puntos: [
        'geocode.maps.co recibe la dirección del alojamiento para ubicarlo en el mapa.',
        'Open-Meteo recibe las coordenadas del alojamiento para el clima y el pronóstico.',
        'open.er-api.com da las tasas de cambio desde pesos colombianos.',
        'Nager.Date y flagcdn reciben el país del alojamiento para los festivos, los países vecinos y la bandera.',
        'Gemini recibe los datos de la estancia (alojamiento, ciudad, fechas, huéspedes y pronóstico), solo si tú le pides su opinión.',
      ],
    },
    {
      id: 'privacidad-ia',
      titulo: 'Tu API key de la IA',
      icono: 'fa-key',
      parrafos: [
        'La API key de Gemini se escribe en un campo tipo contraseña que se vacía al guardarla. Queda en un campo privado de la app, no se vuelve a mostrar y se borra al recargar.',
        'Mientras la usas, la key viaja en cada consulta a Gemini y se puede ver en las herramientas de desarrollador del navegador. Por eso no la uses en computadores compartidos.',
      ],
    },
    {
      id: 'privacidad-acceso',
      titulo: 'Quién ve tu información',
      icono: 'fa-user-shield',
      parrafos: [
        'Tus reservas, favoritos, notificaciones y solicitudes de contacto son de tu cuenta: si otra persona inicia sesión en el mismo navegador, no los ve.',
        'Las reseñas y los alojamientos que publiques sí son públicos y aparecen con tu nombre.',
      ],
    },
    {
      id: 'privacidad-derechos',
      titulo: 'Tus derechos',
      icono: 'fa-scale-balanced',
      parrafos: ['Tienes control sobre tu información:'],
      puntos: [
        'Puedes cambiar tu nombre y tu contraseña desde Mi perfil.',
        'Puedes desactivar los alojamientos que publicaste.',
        'Puedes borrar todo cerrando o recargando la pestaña.',
        'Puedes escribirnos desde Contacto con cualquier duda.',
      ],
    },
  ];

  irASeccion(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
