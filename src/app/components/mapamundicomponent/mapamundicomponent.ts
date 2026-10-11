
import { Component, OnInit, computed, signal } from '@angular/core';
import { Alojamientosservice, Alojamiento } from '../../services/alojamientosservice';

interface PaisMapa {
  clave: string;
  nombre: string;
  ruta: string;
}

interface PaisDisponible {
  clave: string;
  nombre: string;
  cantidad: number;
}

interface GrupoCiudad {
  ciudad: string;
  alojamientos: Alojamiento[];
}

const normalizar = (texto: string): string =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const CODIGO_POR_ID: Record<string, string> = {
  '004': 'AF', '008': 'AL', '010': 'AQ', '012': 'DZ', '024': 'AO',
  '031': 'AZ', '032': 'AR', '036': 'AU', '040': 'AT', '044': 'BS',
  '050': 'BD', '051': 'AM', '056': 'BE', '064': 'BT', '068': 'BO',
  '070': 'BA', '072': 'BW', '076': 'BR', '084': 'BZ', '090': 'SB',
  '096': 'BN', '100': 'BG', '104': 'MM', '108': 'BI', '112': 'BY',
  '116': 'KH', '120': 'CM', '124': 'CA', '140': 'CF', '144': 'LK',
  '148': 'TD', '152': 'CL', '156': 'CN', '158': 'TW', '170': 'CO',
  '178': 'CG', '180': 'CD', '188': 'CR', '191': 'HR', '192': 'CU',
  '196': 'CY', '203': 'CZ', '204': 'BJ', '208': 'DK', '214': 'DO',
  '218': 'EC', '222': 'SV', '226': 'GQ', '231': 'ET', '232': 'ER',
  '233': 'EE', '238': 'FK', '242': 'FJ', '246': 'FI', '250': 'FR',
  '260': 'TF', '262': 'DJ', '266': 'GA', '268': 'GE', '270': 'GM',
  '275': 'PS', '276': 'DE', '288': 'GH', '300': 'GR', '304': 'GL',
  '320': 'GT', '324': 'GN', '328': 'GY', '332': 'HT', '340': 'HN',
  '348': 'HU', '352': 'IS', '356': 'IN', '360': 'ID', '364': 'IR',
  '368': 'IQ', '372': 'IE', '376': 'IL', '380': 'IT', '384': 'CI',
  '388': 'JM', '392': 'JP', '398': 'KZ', '400': 'JO', '404': 'KE',
  '408': 'KP', '410': 'KR', '414': 'KW', '417': 'KG', '418': 'LA',
  '422': 'LB', '426': 'LS', '428': 'LV', '430': 'LR', '434': 'LY',
  '440': 'LT', '442': 'LU', '450': 'MG', '454': 'MW', '458': 'MY',
  '466': 'ML', '478': 'MR', '484': 'MX', '496': 'MN', '498': 'MD',
  '499': 'ME', '504': 'MA', '508': 'MZ', '512': 'OM', '516': 'NA',
  '524': 'NP', '528': 'NL', '540': 'NC', '548': 'VU', '554': 'NZ',
  '558': 'NI', '562': 'NE', '566': 'NG', '578': 'NO', '586': 'PK',
  '591': 'PA', '598': 'PG', '600': 'PY', '604': 'PE', '608': 'PH',
  '616': 'PL', '620': 'PT', '624': 'GW', '626': 'TL', '630': 'PR',
  '634': 'QA', '642': 'RO', '643': 'RU', '646': 'RW', '682': 'SA',
  '686': 'SN', '688': 'RS', '694': 'SL', '703': 'SK', '704': 'VN',
  '705': 'SI', '706': 'SO', '710': 'ZA', '716': 'ZW', '724': 'ES',
  '728': 'SS', '729': 'SD', '732': 'EH', '740': 'SR', '748': 'SZ',
  '752': 'SE', '756': 'CH', '760': 'SY', '762': 'TJ', '764': 'TH',
  '768': 'TG', '780': 'TT', '784': 'AE', '788': 'TN', '792': 'TR',
  '795': 'TM', '800': 'UG', '804': 'UA', '807': 'MK', '818': 'EG',
  '826': 'GB', '834': 'TZ', '840': 'US', '854': 'BF', '858': 'UY',
  '860': 'UZ', '862': 'VE', '887': 'YE', '894': 'ZM'
};

const NOMBRES_ES = new Intl.DisplayNames(['es'], { type: 'region' });

const CODIGO_POR_NOMBRE: Record<string, string> = (() => {
  const tabla: Record<string, string> = {};

  for (let i = 65; i <= 90; i++) {
    for (let j = 65; j <= 90; j++) {
      const codigo = String.fromCharCode(i, j);
      let nombre: string | undefined;

      try {
        nombre = NOMBRES_ES.of(codigo);
      } catch {
        continue;
      }

      if (nombre && nombre !== codigo && !(normalizar(nombre) in tabla)) {
        tabla[normalizar(nombre)] = codigo;
      }
    }
  }

  return tabla;
})();

const SINONIMOS: Record<string, string> = {
  'ee.uu.': 'US',
  'eeuu': 'US',
  'usa': 'US',
  'estados unidos de america': 'US',
  'inglaterra': 'GB',
  'escocia': 'GB',
  'gales': 'GB',
  'holanda': 'NL',
  'republica checa': 'CZ',
  'costa de marfil': 'CI',
  'birmania': 'MM',
  'myanmar': 'MM'
};

const claveDePais = (pais: string): string => {
  const normalizado = normalizar(pais);
  return SINONIMOS[normalizado] ??
    CODIGO_POR_NOMBRE[normalizado] ??
    normalizado;
};

@Component({
  selector: 'app-mapamundicomponent',
  standalone: false,
  templateUrl: './mapamundicomponent.html',
  styleUrl: './mapamundicomponent.css'
})
export class Mapamundicomponent implements OnInit {
  alojamientos = signal<Alojamiento[]>([]);
  paises = signal<PaisMapa[]>([]);
  cargando = signal(true);
  seleccionado = signal<string | null>(null);

  paisesDisponibles = computed<PaisDisponible[]>(() => {
    const porClave = new Map<string, PaisDisponible>();

    for (const alojamiento of this.alojamientos()) {
      const clave = claveDePais(alojamiento.pais);
      const actual = porClave.get(clave);

      if (actual) {
        actual.cantidad++;
      } else {
        porClave.set(clave, {
          clave,
          nombre: alojamiento.pais,
          cantidad: 1
        });
      }
    }

    return [...porClave.values()].sort(
      (a, b) => a.nombre.localeCompare(b.nombre, 'es')
    );
  });

  clavesDisponibles = computed(
    () => new Set(this.paisesDisponibles().map(p => p.clave))
  );

  paisActivo = computed<PaisDisponible | null>(
    () => this.paisesDisponibles().find(
      p => p.clave === this.seleccionado()
    ) ?? null
  );

  ciudadesDelPais = computed<GrupoCiudad[]>(() => {
    const clave = this.seleccionado();

    if (!clave) {
      return [];
    }

    const porCiudad = new Map<string, Alojamiento[]>();

    for (const alojamiento of this.alojamientos()) {
      if (claveDePais(alojamiento.pais) !== clave) {
        continue;
      }

      const ciudad = alojamiento.ciudad;
      const lista = porCiudad.get(ciudad) ?? [];

      porCiudad.set(ciudad, [...lista, alojamiento]);
    }

    return [...porCiudad.entries()]
      .sort((a, b) => a[0].localeCompare(b[0], 'es'))
      .map(([ciudad, alojamientos]) => ({
        ciudad,
        alojamientos
      }));
  });

  constructor(
    private alojamientosService: Alojamientosservice
  ) {}

  ngOnInit(): void {
    void this.dibujarMapa();

    this.alojamientosService.obtenerAlojamientos().subscribe({
      next: (alojamientos) => {
        this.alojamientos.set(alojamientos);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar los alojamientos:', error);
        this.alojamientos.set([]);
        this.cargando.set(false);
      }
    });
  }

  esDisponible(clave: string): boolean {
    return this.clavesDisponibles().has(clave);
  }

  seleccionarPorClave(clave: string): void {
    if (this.esDisponible(clave)) {
      this.seleccionado.set(clave);
    }
  }

  limpiarSeleccion(): void {
    this.seleccionado.set(null);
  }

  onImgError(event: Event, id: number): void {
    const img = event.target as HTMLImageElement;

    img.onerror = null;
    img.src = `https://picsum.photos/seed/alojamiento-${id}/600/400`;
  }

  private async dibujarMapa(): Promise<void> {
    try {
      const [
        { geoNaturalEarth1, geoPath },
        { feature },
        mundo
      ] = await Promise.all([
        import('d3-geo'),
        import('topojson-client'),
        import('world-atlas/countries-110m.json')
      ]);

      const topologia: any = mundo.default;
      const geo: any = feature(
        topologia,
        topologia.objects.countries
      );

      const generarRuta = geoPath(
        geoNaturalEarth1().fitSize([960, 500], geo)
      );

      this.paises.set(
        geo.features.map((f: any) => {
          const clave: string =
            CODIGO_POR_ID[String(f.id).padStart(3, '0')] ??
            (f.properties.name === 'Kosovo'
              ? 'XK'
              : normalizar(f.properties.name));

          return {
            clave,
            nombre: clave.length === 2
              ? (NOMBRES_ES.of(clave) ?? f.properties.name)
              : f.properties.name,
            ruta: generarRuta(f) ?? ''
          };
        })
      );
    } catch (error) {
      console.error('Error al dibujar el mapa mundial:', error);
      this.paises.set([]);
    }
  }
}
