import { Component } from '@angular/core';
import { Idiomaservice } from '../../services/idiomaservice';

@Component({
  selector: 'app-footercomponent',
  standalone: false,
  styleUrl: './footercomponent.css',
  templateUrl: './footercomponent.html',
})
export class Footercomponent {
  readonly anioActual = new Date().getFullYear();

  constructor(private idiomaService: Idiomaservice) {}

  traducir(clave: string, parametros?: Record<string, string | number>): string {
    return this.idiomaService.traducir(clave, parametros);
  }
}
