import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Alojamientosservice, Alojamiento, Resena } from '../../services/alojamientosservice';
import { Geocodingservice, Coordenadas } from '../../services/geocodingservice';
import { Climaservice, Clima, PronosticoEstancia } from '../../services/climaservice';
import { Exchangerateservice, Moneda } from '../../services/exchangerateservice';
import { Favoritosservice } from '../../services/favoritosservice';
import { Paisesservice, DatosPais, Festivo } from '../../services/paisesservice';
import { Cotizacion, Cotizadorcomponent } from '../cotizadorcomponent/cotizadorcomponent';
import {ToastService} from '../../services/toastservice';

@Component({
  selector: 'app-detallecomponent',
  standalone: false,
  styleUrl: './detallecomponent.css',
  templateUrl: './detallecomponent.html',
})
export class Detallecomponent implements OnInit {
  @ViewChild(Cotizadorcomponent) cotizador?: Cotizadorcomponent;

  alojamiento = signal<Alojamiento | null>(null);
  resenas = signal<Resena[]>([]);
  imagenActiva = signal('');
  cargando = signal(true);
  noEncontrado = signal(false);
  cotizacionActual = signal<Cotizacion | null>(null);
  coordenadas = signal<Coordenadas | null>(null);
  ubicacionMapaUrl = signal<string | null>(null);
  mapaIncrustadoUrl = signal<SafeResourceUrl | null>(null);
  clima = signal<Clima | null>(null);
  pronostico = signal<PronosticoEstancia | null>(null);
  cargandoPronostico = signal(false);
  pronosticoFueraDeRango = signal(false);
  datosPais = signal<DatosPais | null>(null);
  festivos = signal<Festivo[]>([]);

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private alojamientosService: Alojamientosservice,
    private geocodingService: Geocodingservice,
    private climaService: Climaservice,
    private exchangeRateService: Exchangerateservice,
    private favoritosService: Favoritosservice,
    private paisesService: Paisesservice,
    private router: Router,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.exchangeRateService.cargarTasas().subscribe();
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.cargarAlojamiento(id);
    });
  }

  esFavorito(id: number): boolean {
    return this.favoritosService.esFavorito(id);
  }

  alternarFavorito(id: number): void {
    const resultado = this.favoritosService.alternar(id);

    if (!resultado) {
      this.router.navigate(['/login'], {
        queryParams: { volverA: this.router.url }
      });
      return;
    }

    if (this.favoritosService.esFavorito(id)) {
      this.toastService.mostrar('Alojamiento agregado a favoritos');
    } else {
      this.toastService.mostrar('Alojamiento eliminado de favoritos');
    }
  }
  monedas(): Moneda[] {
    return this.exchangeRateService.MONEDAS;
  }

  monedaActiva(): Moneda {
    return this.exchangeRateService.monedaActiva();
  }

  hayTasas(): boolean {
    return this.exchangeRateService.tasas() !== null;
  }

  cambiarMoneda(moneda: Moneda): void {
    this.exchangeRateService.cambiarMoneda(moneda);
  }

  convertir(valorEnCop: number): number {
    return this.exchangeRateService.convertir(valorEnCop);
  }

  formatoDecimales(): string {
    return this.exchangeRateService.formatoDecimales();
  }

  fechaLimitePronostico(): string {
    return this.climaService.fechaLimitePronostico();
  }

  recargarResenas(alojamientoId: number): void {
    this.alojamientosService.obtenerResenasPorAlojamiento(alojamientoId).subscribe((resenas) => {
      this.resenas.set(resenas);
    });
    this.alojamientosService.obtenerPorId(alojamientoId).subscribe((alojamiento) => {
      if (alojamiento) {
        this.alojamiento.set(alojamiento);
      }
    });
  }

  onPagoRealizado(): void {
    this.cotizador?.reiniciar();
  }

  onCotizacionLista(cotizacion: Cotizacion | null): void {
    this.cotizacionActual.set(cotizacion);
    this.consultarPronostico(cotizacion);
    this.consultarFestivos(cotizacion);
  }

  cambiarImagen(url: string): void {
    this.imagenActiva.set(url);
  }

  onImgError(event: Event, id: number): void {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    img.src = `https://picsum.photos/seed/alojamiento-${id}/800/500`;
  }

  private cargarAlojamiento(id: number): void {
    this.cargando.set(true);
    this.noEncontrado.set(false);
    this.cotizacionActual.set(null);
    this.coordenadas.set(null);
    this.ubicacionMapaUrl.set(null);
    this.mapaIncrustadoUrl.set(null);
    this.clima.set(null);
    this.pronostico.set(null);
    this.pronosticoFueraDeRango.set(false);
    this.datosPais.set(null);
    this.festivos.set([]);

    this.alojamientosService.obtenerPorId(id).subscribe((alojamiento) => {
      if (!alojamiento) {
        this.noEncontrado.set(true);
        this.cargando.set(false);
        return;
      }

      this.alojamiento.set(alojamiento);
      this.imagenActiva.set(alojamiento.imagenPrincipal);
      this.cargando.set(false);

      this.paisesService.obtenerDatosPais(alojamiento.pais).subscribe((datos) => {
        this.datosPais.set(datos);
      });

      this.alojamientosService.obtenerResenasPorAlojamiento(id).subscribe((resenas) => {
        this.resenas.set(resenas);
      });

      const direccion = `${alojamiento.ubicacion}, ${alojamiento.ciudad}, ${alojamiento.pais}`;
      this.geocodingService.obtenerCoordenadas(direccion).subscribe((coords) => {
        if (!coords) {
          return;
        }

        this.coordenadas.set(coords);
        this.ubicacionMapaUrl.set(`https://www.google.com/maps?q=${coords.lat},${coords.lon}`);
        this.mapaIncrustadoUrl.set(this.armarMapaIncrustado(coords));

        this.climaService.obtenerClima(coords.lat, coords.lon).subscribe((clima) => {
          this.clima.set(clima);
        });

        this.consultarPronostico(this.cotizacionActual());
      });
    });
  }

  private consultarPronostico(cotizacion: Cotizacion | null): void {
    this.pronostico.set(null);
    this.pronosticoFueraDeRango.set(false);
    this.cargandoPronostico.set(false);

    const coords = this.coordenadas();
    if (!cotizacion || !coords) {
      return;
    }

    if (cotizacion.fechaInicio > this.climaService.fechaLimitePronostico()) {
      this.pronosticoFueraDeRango.set(true);
      return;
    }

    this.cargandoPronostico.set(true);
    this.climaService
      .obtenerPronosticoEstancia(coords.lat, coords.lon, cotizacion.fechaInicio, cotizacion.fechaFin)
      .subscribe((pronostico) => {
        if (this.cotizacionActual() !== cotizacion) {
          return;
        }
        this.pronostico.set(pronostico);
        this.cargandoPronostico.set(false);
      });
  }

  private consultarFestivos(cotizacion: Cotizacion | null): void {
    this.festivos.set([]);
    const alojamiento = this.alojamiento();
    if (!cotizacion || !alojamiento) {
      return;
    }

    this.paisesService
      .obtenerFestivosEnEstancia(alojamiento.pais, cotizacion.fechaInicio, cotizacion.fechaFin)
      .subscribe((festivos) => {
        if (this.cotizacionActual() === cotizacion) {
          this.festivos.set(festivos);
        }
      });
  }

  private armarMapaIncrustado(coords: Coordenadas): SafeResourceUrl {
    const margenLon = 0.01;
    const margenLat = 0.006;
    const caja = [coords.lon - margenLon, coords.lat - margenLat, coords.lon + margenLon, coords.lat + margenLat].join(',');
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${caja}&layer=mapnik&marker=${coords.lat},${coords.lon}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
