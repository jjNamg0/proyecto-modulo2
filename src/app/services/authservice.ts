import { Injectable, signal } from '@angular/core';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  password: string;
}

export interface DatosRegistro {
  nombre: string;
  correo: string;
  password: string;
}

export interface ResultadoAuth {
  exito: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Authservice {
  private usuarios: Usuario[] = [];
  private siguienteId = 1;

  usuarioActual = signal<Usuario | null>(null);

  registrar(datos: DatosRegistro): ResultadoAuth {
    const yaExiste = this.usuarios.some((u) => u.correo === datos.correo);
    if (yaExiste) {
      return { exito: false, error: 'Ya existe una cuenta con ese correo.' };
    }

    const usuario: Usuario = { ...datos, id: this.siguienteId++ };
    this.usuarios.push(usuario);
    this.usuarioActual.set(usuario);
    return { exito: true };
  }

  iniciarSesion(correo: string, password: string): ResultadoAuth {
    const usuario = this.usuarios.find((u) => u.correo === correo && u.password === password);
    if (!usuario) {
      return { exito: false, error: 'Correo o contraseña incorrectos.' };
    }

    this.usuarioActual.set(usuario);
    return { exito: true };
  }

  cerrarSesion(): void {
    this.usuarioActual.set(null);
  }

  actualizarNombre(nombre: string): ResultadoAuth {
    const usuario = this.usuarioGuardado();
    if (!usuario) {
      return { exito: false, error: 'No hay una sesión iniciada.' };
    }

    usuario.nombre = nombre;
    this.usuarioActual.set({ ...usuario });
    return { exito: true };
  }

  cambiarPassword(passwordActual: string, passwordNueva: string): ResultadoAuth {
    const usuario = this.usuarioGuardado();
    if (!usuario) {
      return { exito: false, error: 'No hay una sesión iniciada.' };
    }
    if (usuario.password !== passwordActual) {
      return { exito: false, error: 'La contraseña actual no es correcta.' };
    }

    usuario.password = passwordNueva;
    this.usuarioActual.set({ ...usuario });
    return { exito: true };
  }

  private usuarioGuardado(): Usuario | undefined {
    const actual = this.usuarioActual();
    return actual ? this.usuarios.find((u) => u.id === actual.id) : undefined;
  }
}
