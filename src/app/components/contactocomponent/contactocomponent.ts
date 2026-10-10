import { Component, OnInit, signal } from '@angular/core';
import { Authservice, Usuario } from '../../services/authservice';
import { Contactoservice, SolicitudContacto } from '../../services/contactoservice';
import { Reserva, Reservasservice } from '../../services/reservasservice';

declare const Swal: any;

interface PreguntaFrecuente {
  pregunta: string;
  respuesta: string;
}

@Component({
  selector: 'app-contactocomponent',
  standalone: false,
  styleUrl: './contactocomponent.css',
  templateUrl: './contactocomponent.html',
})
export class Contactocomponent implements OnInit {
  readonly MINIMO_MENSAJE = 20;
  readonly MAXIMO_MENSAJE = 500;

  readonly PREGUNTAS: PreguntaFrecuente[] = [
    {
      pregunta: '¿Cómo reservo un alojamiento?',
      respuesta:
        'Entra al detalle del alojamiento, elige las fechas y los huéspedes en "Cotiza tu estancia" y, con la sesión iniciada, completa el pago en el panel que aparece debajo.',
    },
    {
      pregunta: '¿Puedo cancelar una reserva?',
      respuesta:
        'Sí. En Mis reservas cada reserva confirmada tiene el botón "Cancelar reserva". Las fechas quedan libres otra vez.',
    },
    {
      pregunta: '¿Dónde veo el comprobante de mi reserva?',
      respuesta:
        'En Mis reservas, con el botón "Ver comprobante". Desde ahí lo puedes imprimir o guardar como PDF.',
    },
    {
      pregunta: '¿Cómo uso un cupón de descuento?',
      respuesta:
        'Escribe el código en "¿Tienes un cupón?" dentro del panel de pago y dale Aplicar. Solo se usa un cupón por reserva y el descuento es sobre las noches.',
    },
    {
      pregunta: '¿Cómo comparo alojamientos?',
      respuesta:
        'En el listado o en el detalle dale al botón de comparar de hasta 3 alojamientos. Luego dale "Comparar" en la barra que sale abajo.',
    },
    {
      pregunta: '¿Por qué se borró todo al recargar la página?',
      respuesta:
        'La app guarda todo en la memoria del navegador, sin servidor. Al recargar o cerrar la pestaña se pierden la sesión, las reservas y los favoritos.',
    },
    {
      pregunta: '¿Cómo funciona la opinión de la IA?',
      respuesta:
        'Cuando las fechas tienen pronóstico (los próximos 16 días), pega tu API key de Gemini en "Opinión de la IA" y pídele su recomendación según el clima.',
    },
  ];

  nombre = '';
  asunto = '';
  reservaId: number | null = null;
  mensaje = '';
  error = '';

  preguntaAbierta = signal<number | null>(0);
  solicitudes = signal<SolicitudContacto[]>([]);

  constructor(
    private authService: Authservice,
    private contactoService: Contactoservice,
    private reservasService: Reservasservice,
  ) {}

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  usuarioActual(): Usuario | null {
    return this.authService.usuarioActual();
  }

  asuntos(): string[] {
    return this.contactoService.ASUNTOS;
  }

  pideReserva(): boolean {
    return this.contactoService.ASUNTOS_CON_RESERVA.includes(this.asunto);
  }

  misReservas(): Reserva[] {
    const usuario = this.usuarioActual();
    return usuario ? this.reservasService.obtenerReservasDe(usuario.correo) : [];
  }

  alternarPregunta(indice: number): void {
    this.preguntaAbierta.update((abierta) => (abierta === indice ? null : indice));
  }

  enviar(): void {
    this.error = '';
    const usuario = this.usuarioActual();
    const nombre = usuario ? usuario.nombre : this.nombre.trim();
    const mensaje = this.mensaje.trim();

    if (!nombre) {
      this.error = 'Escribe tu nombre.';
      return;
    }

    if (!this.asunto) {
      this.error = 'Elige el asunto de tu mensaje.';
      return;
    }

    if (mensaje.length < this.MINIMO_MENSAJE) {
      this.error = `Cuéntanos un poco más: el mensaje debe tener mínimo ${this.MINIMO_MENSAJE} caracteres.`;
      return;
    }

    if (mensaje.length > this.MAXIMO_MENSAJE) {
      this.error = `El mensaje no puede pasar de ${this.MAXIMO_MENSAJE} caracteres.`;
      return;
    }

    const solicitud = this.contactoService.enviar({
      nombre,
      cuenta: usuario?.correo ?? null,
      asunto: this.asunto,
      reservaId: this.pideReserva() ? this.reservaId : null,
      mensaje,
    });

    this.nombre = '';
    this.asunto = '';
    this.reservaId = null;
    this.mensaje = '';
    this.cargarSolicitudes();

    Swal.fire({
      icon: 'success',
      title: '¡Solicitud registrada!',
      html: usuario
        ? `Tu solicitud <strong>#${solicitud.id}</strong> quedó guardada.<br>La puedes ver en "Tus solicitudes".`
        : `Tu solicitud <strong>#${solicitud.id}</strong> quedó guardada.`,
      confirmButtonText: 'Listo',
      background: '#181b25',
      color: '#dfe2ef',
    });
  }

  private cargarSolicitudes(): void {
    const usuario = this.usuarioActual();
    this.solicitudes.set(usuario ? this.contactoService.obtenerSolicitudesDe(usuario.correo) : []);
  }
}
