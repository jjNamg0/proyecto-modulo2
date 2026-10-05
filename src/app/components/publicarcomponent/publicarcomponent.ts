import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Alojamientosservice } from '../../services/alojamientosservice';
import { Authservice, Usuario } from '../../services/authservice';

declare const Swal: any;

@Component({
  selector: 'app-publicarcomponent',
  standalone: false,
  styleUrl: './publicarcomponent.css',
  templateUrl: './publicarcomponent.html',
})
export class Publicarcomponent implements OnInit {
  tipos = signal<string[]>([]);
  paises = signal<string[]>([]);
  ciudades = signal<string[]>([]);
  serviciosComunes = signal<string[]>([]);

  nombre = '';
  descripcion = '';
  pais = '';
  ciudad = '';
  ubicacion = '';
  tipo = '';
  capacidad: number | null = 2;
  habitaciones: number | null = 1;
  camas: number | null = 1;
  banos: number | null = 1;
  precioNoche: number | null = null;
  tarifaLimpieza: number | null = null;
  imagenPrincipal = '';
  imagenesExtra = '';
  serviciosSeleccionados: string[] = [];
  otrosServicios = '';
  reglasTexto = '';
  errorPublicar = '';

  constructor(
    private alojamientosService: Alojamientosservice,
    private authService: Authservice,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.alojamientosService.obtenerTipos().subscribe((tipos) => this.tipos.set(tipos));
    this.alojamientosService.obtenerPaises().subscribe((paises) => this.paises.set(paises));
    this.alojamientosService.obtenerCiudades().subscribe((ciudades) => this.ciudades.set(ciudades));
    this.alojamientosService.obtenerServiciosComunes(12).subscribe((servicios) => this.serviciosComunes.set(servicios));
  }

  usuarioActual(): Usuario | null {
    return this.authService.usuarioActual();
  }

  estaSeleccionado(servicio: string): boolean {
    return this.serviciosSeleccionados.includes(servicio);
  }

  alternarServicio(servicio: string): void {
    this.serviciosSeleccionados = this.estaSeleccionado(servicio)
      ? this.serviciosSeleccionados.filter((s) => s !== servicio)
      : [...this.serviciosSeleccionados, servicio];
  }

  esUrlValida(url: string): boolean {
    return /^https?:\/\/\S+$/.test(url.trim());
  }

  publicar(): void {
    this.errorPublicar = '';
    const usuario = this.usuarioActual();

    if (!usuario) {
      this.errorPublicar = 'Debes iniciar sesión para publicar un alojamiento.';
      return;
    }

    const textosObligatorios = [this.nombre, this.descripcion, this.pais, this.ciudad, this.ubicacion, this.tipo];
    if (textosObligatorios.some((texto) => !texto.trim())) {
      this.errorPublicar = 'Completa el nombre, la descripción, la ubicación y el tipo de alojamiento.';
      return;
    }

    const cantidades = [this.capacidad, this.habitaciones, this.camas, this.banos];
    if (cantidades.some((cantidad) => !cantidad || cantidad < 1 || !Number.isInteger(cantidad))) {
      this.errorPublicar = 'Capacidad, habitaciones, camas y baños deben ser números enteros mayores a cero.';
      return;
    }

    if (!this.precioNoche || this.precioNoche <= 0) {
      this.errorPublicar = 'El precio por noche debe ser mayor que cero.';
      return;
    }

    if (this.tarifaLimpieza === null || this.tarifaLimpieza < 0) {
      this.errorPublicar = 'La tarifa de limpieza no puede ser negativa (pon 0 si no cobras limpieza).';
      return;
    }

    const imagenesExtra = this.separarLineas(this.imagenesExtra);
    if (!this.esUrlValida(this.imagenPrincipal) || imagenesExtra.some((url) => !this.esUrlValida(url))) {
      this.errorPublicar = 'Las imágenes deben ser enlaces que empiecen por http:// o https://.';
      return;
    }

    const otros = this.otrosServicios
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s);
    const servicios = [...new Set([...this.serviciosSeleccionados, ...otros])];
    if (servicios.length === 0) {
      this.errorPublicar = 'Selecciona al menos un servicio.';
      return;
    }

    const imagenPrincipal = this.imagenPrincipal.trim();
    const nuevo = this.alojamientosService.agregarAlojamiento({
      nombre: this.nombre.trim(),
      descripcion: this.descripcion.trim(),
      pais: this.pais.trim(),
      ciudad: this.ciudad.trim(),
      ubicacion: this.ubicacion.trim(),
      tipo: this.tipo,
      capacidad: this.capacidad!,
      habitaciones: this.habitaciones!,
      camas: this.camas!,
      banos: this.banos!,
      precioNoche: this.precioNoche,
      tarifaLimpieza: this.tarifaLimpieza,
      imagenPrincipal,
      imagenes: [imagenPrincipal, ...imagenesExtra],
      servicios,
      reglas: this.separarLineas(this.reglasTexto),
      publicadoPor: usuario.nombre,
    });

    Swal.fire({
      icon: 'success',
      title: '¡Alojamiento publicado!',
      html: `<strong>${nuevo.nombre}</strong> ya aparece en el listado.`,
      confirmButtonText: 'Ver mi alojamiento',
      background: '#181b25',
      color: '#dfe2ef',
    });

    this.router.navigate(['/alojamientos', nuevo.id]);
  }

  private separarLineas(texto: string): string[] {
    return texto
      .split('\n')
      .map((linea) => linea.trim())
      .filter((linea) => linea);
  }
}
