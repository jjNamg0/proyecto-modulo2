import { Component, Input, OnChanges, OnDestroy, SimpleChanges, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { Alojamiento } from '../../services/alojamientosservice';
import { PronosticoEstancia } from '../../services/climaservice';
import { Iaservice } from '../../services/iaservice';
import { Cotizacion } from '../cotizadorcomponent/cotizadorcomponent';

@Component({
  selector: 'app-iaopinioncomponent',
  standalone: false,
  styleUrl: './iaopinioncomponent.css',
  templateUrl: './iaopinioncomponent.html',
})
export class Iaopinioncomponent implements OnChanges, OnDestroy {
  @Input() alojamiento!: Alojamiento;
  @Input() cotizacion!: Cotizacion;
  @Input() pronostico!: PronosticoEstancia;

  mostrarFormularioKey = signal(false);
  validandoKey = signal(false);
  errorKey = signal('');
  mensajeKey = signal('');
  consultando = signal(false);
  opinion = signal('');
  errorOpinion = signal('');

  private consulta: Subscription | null = null;

  constructor(private iaService: Iaservice) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cotizacion'] || changes['pronostico']) {
      this.cancelarConsulta();
      this.opinion.set('');
      this.errorOpinion.set('');
    }
  }

  ngOnDestroy(): void {
    this.cancelarConsulta();
  }

  keyConfigurada(): boolean {
    return this.iaService.keyConfigurada();
  }

  guardarKey(campo: HTMLInputElement): void {
    const key = campo.value;
    campo.value = '';
    this.errorKey.set('');
    this.mensajeKey.set('');
    this.validandoKey.set(true);

    this.iaService.configurarKey(key).subscribe((resultado) => {
      this.validandoKey.set(false);
      if (!resultado.exito) {
        this.errorKey.set(resultado.error ?? 'No se pudo configurar la key.');
        return;
      }
      this.mostrarFormularioKey.set(false);
      this.mensajeKey.set('API key configurada.');
    });
  }

  cambiarKey(): void {
    this.errorKey.set('');
    this.mensajeKey.set('');
    this.mostrarFormularioKey.set(true);
  }

  cancelarCambio(): void {
    this.errorKey.set('');
    this.mostrarFormularioKey.set(false);
  }

  quitarKey(): void {
    this.cancelarConsulta();
    this.iaService.quitarKey();
    this.opinion.set('');
    this.errorOpinion.set('');
    this.mensajeKey.set('');
    this.mostrarFormularioKey.set(false);
  }

  pedirOpinion(): void {
    if (this.consultando() || this.opinion()) {
      return;
    }

    this.consultando.set(true);
    this.errorOpinion.set('');

    this.consulta = this.iaService
      .opinarSobreEstancia({
        alojamiento: this.alojamiento.nombre,
        ciudad: this.alojamiento.ciudad,
        pais: this.alojamiento.pais,
        fechaInicio: this.cotizacion.fechaInicio,
        fechaFin: this.cotizacion.fechaFin,
        noches: this.cotizacion.noches,
        huespedes: this.cotizacion.huespedes,
        dias: this.pronostico.dias,
        veredicto: this.pronostico.veredicto,
      })
      .subscribe((resultado) => {
        this.consultando.set(false);
        this.consulta = null;
        if (resultado.exito) {
          this.opinion.set(resultado.texto ?? '');
        } else {
          this.errorOpinion.set(resultado.error ?? 'No se pudo consultar a la IA.');
        }
      });
  }

  private cancelarConsulta(): void {
    this.consulta?.unsubscribe();
    this.consulta = null;
    this.consultando.set(false);
  }
}
