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
}
