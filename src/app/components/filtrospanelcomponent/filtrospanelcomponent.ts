import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Filtros, FILTROS_VACIOS } from '../../services/alojamientosservice';

@Component({
  selector: 'app-filtrospanelcomponent',
  standalone: false,
  styleUrl: './filtrospanelcomponent.css',
  templateUrl: './filtrospanelcomponent.html',
})
export class Filtrospanelcomponent {
  @Input() ciudades: string[] = [];
  @Input() tipos: string[] = [];
  @Output() filtrosCambiados = new EventEmitter<Filtros>();

  filtros: Filtros = { ...FILTROS_VACIOS };

  emitirCambio(): void {
    this.filtrosCambiados.emit({ ...this.filtros });
  }

  limpiarFiltros(): void {
    this.filtros = { ...FILTROS_VACIOS };
    this.emitirCambio();
  }
}
