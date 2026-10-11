import { Component, OnInit, signal } from '@angular/core';
import { Alojamientosservice, Alojamiento } from '../../services/alojamientosservice';
import { Authservice, Usuario } from '../../services/authservice';
import { Reservasservice } from '../../services/reservasservice';
import { Favoritosservice } from '../../services/favoritosservice';

declare const Swal: any;

@Component({
  selector: 'app-perfilcomponent',
  standalone: false,
  styleUrl: './perfilcomponent.css',
  templateUrl: './perfilcomponent.html',
})
export class Perfilcomponent implements OnInit {
  publicaciones = signal<Alojamiento[]>([]);

  nombre = '';
  mensajeNombre = '';
  errorNombre = '';

  passwordActual = '';
  passwordNueva = '';
  passwordConfirmacion = '';
  mensajePassword = '';
  errorPassword = '';

  constructor(
    private authService: Authservice,
    private alojamientosService: Alojamientosservice,
    private reservasService: Reservasservice,
    private favoritosService: Favoritosservice,
  ) {}

  ngOnInit(): void {
    this.nombre = this.usuarioActual()?.nombre ?? '';
    this.cargarPublicaciones();
  }

  usuarioActual(): Usuario | null {
    return this.authService.usuarioActual();
  }

  reservasActivas(): number {
    const usuario = this.usuarioActual();
    if (!usuario) {
      return 0;
    }
    return this.reservasService.obtenerReservasDe(usuario.correo).filter((r) => r.estado === 'CONFIRMADA').length;
  }

  cantidadFavoritos(): number {
    return this.favoritosService.obtenerIds().length;
  }

  guardarNombre(): void {
    this.mensajeNombre = '';
    this.errorNombre = '';
    const usuario = this.usuarioActual();
    const nombre = this.nombre.trim();

    if (!nombre) {
      this.errorNombre = 'El nombre no puede quedar vacío.';
      return;
    }

    const resultado = this.authService.actualizarNombre(nombre);
    if (!resultado.exito || !usuario) {
      this.errorNombre = resultado.error ?? 'No se pudo actualizar el nombre.';
      return;
    }

    this.alojamientosService.actualizarNombrePublicador(usuario.correo, nombre);
    this.cargarPublicaciones();
    this.mensajeNombre = 'Nombre actualizado.';
  }

  cambiarPassword(): void {
    this.mensajePassword = '';
    this.errorPassword = '';

    if (!this.passwordActual || !this.passwordNueva || !this.passwordConfirmacion) {
      this.errorPassword = 'Completa los tres campos.';
      return;
    }

    if (this.passwordNueva.length < 4) {
      this.errorPassword = 'La contraseña nueva debe tener al menos 4 caracteres.';
      return;
    }

    if (this.passwordNueva !== this.passwordConfirmacion) {
      this.errorPassword = 'La confirmación no coincide con la contraseña nueva.';
      return;
    }

    const resultado = this.authService.cambiarPassword(this.passwordActual, this.passwordNueva);
    if (!resultado.exito) {
      this.errorPassword = resultado.error ?? 'No se pudo cambiar la contraseña.';
      return;
    }

    this.passwordActual = '';
    this.passwordNueva = '';
    this.passwordConfirmacion = '';
    this.mensajePassword = 'Contraseña actualizada.';
  }

  cambiarEstado(alojamiento: Alojamiento): void {
    const usuario = this.usuarioActual();
    if (!usuario) {
      return;
    }

    if (!alojamiento.activo) {
      this.alojamientosService.cambiarEstadoAlojamiento(alojamiento.id, usuario.correo, true);
      this.cargarPublicaciones();
      return;
    }

    Swal.fire({
      icon: 'warning',
      title: '¿Desactivar el alojamiento?',
      html: `<strong>${alojamiento.nombre}</strong> dejará de aparecer en el listado y nadie podrá reservarlo.<br>Puedes volver a activarlo cuando quieras.`,
      showCancelButton: true,
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'No',
      confirmButtonColor: '#dc3545',
      background: '#181b25',
      color: '#dfe2ef',
    }).then((resultado: { isConfirmed: boolean }) => {
      if (resultado.isConfirmed) {
        this.alojamientosService.cambiarEstadoAlojamiento(alojamiento.id, usuario.correo, false);
        this.cargarPublicaciones();
      }
    });
  }

  onImgError(event: Event): void {
    this.alojamientosService.usarImagenRespaldo(event);
  }

  private cargarPublicaciones(): void {
    const usuario = this.usuarioActual();
    this.publicaciones.set(usuario ? [...this.alojamientosService.obtenerPublicacionesDe(usuario.correo)] : []);
  }
}
