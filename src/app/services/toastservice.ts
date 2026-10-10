import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  mensaje = signal('');
  tipo = signal('');

  mostrar(mensaje: string, tipo: string = 'success'): void {
    this.mensaje.set(mensaje);
    this.tipo.set(tipo);

    setTimeout(() => {
      this.mensaje.set('');
      this.tipo.set('');
    }, 3000);
  }
}
