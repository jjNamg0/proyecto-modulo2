import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Filtros, FILTROS_VACIOS } from '../../services/alojamientosservice';
import { Idiomaservice } from '../../services/idiomaservice';

@Component({
  selector: 'app-filtrospanelcomponent',
  standalone: false,
  styleUrl: './filtrospanelcomponent.css',
  templateUrl: './filtrospanelcomponent.html',
})
export class Filtrospanelcomponent {
  @Input() paises: string[] = [];
  @Input() ciudades: string[] = [];
  @Input() tipos: string[] = [];
  @Output() filtrosCambiados = new EventEmitter<Filtros>();

  filtros: Filtros = { ...FILTROS_VACIOS };

  constructor(private idiomaService: Idiomaservice) {}

  emitirCambio(): void {
    this.filtrosCambiados.emit({ ...this.filtros });
  }

  cambiarPais(): void {
    this.filtros.ciudad = '';
    this.emitirCambio();
  }

  limpiarFiltros(): void {
    this.filtros = { ...FILTROS_VACIOS };
    this.emitirCambio();
  }

  traducir(clave: string, parametros?: Record<string, string | number>): string {
    return this.idiomaService.traducir(clave, parametros);
  }
}
