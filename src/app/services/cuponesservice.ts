import { Injectable } from '@angular/core';

export interface Cupon {
  codigo: string;
  porcentaje: number;
  minimoNoches: number;
  venceEl: string;
}

export interface ResultadoCupon {
  exito: boolean;
  cupon?: Cupon;
  descuento?: number;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Cuponesservice {
  private readonly CUPONES: Cupon[] = [
    { codigo: 'BOSQUE10', porcentaje: 10, minimoNoches: 1, venceEl: '2026-12-31' },
    { codigo: 'NOCTURNA20', porcentaje: 20, minimoNoches: 3, venceEl: '2026-12-31' },
    { codigo: 'VERANO15', porcentaje: 15, minimoNoches: 2, venceEl: '2026-09-30' },
  ];

  validar(codigo: string, noches: number, subtotal: number): ResultadoCupon {
    const codigoLimpio = codigo.trim().toUpperCase();
    if (!codigoLimpio) {
      return { exito: false, error: 'Escribe el código del cupón.' };
    }

    const cupon = this.CUPONES.find((c) => c.codigo === codigoLimpio);
    if (!cupon) {
      return { exito: false, error: `El cupón ${codigoLimpio} no existe.` };
    }

    if (this.fechaLocalHoy() > cupon.venceEl) {
      return { exito: false, error: `El cupón ${codigoLimpio} venció el ${this.formatearFecha(cupon.venceEl)}.` };
    }

    if (noches < cupon.minimoNoches) {
      return {
        exito: false,
        error: `El cupón ${codigoLimpio} es para estancias de mínimo ${cupon.minimoNoches} noches.`,
      };
    }

    return { exito: true, cupon, descuento: Math.round((subtotal * cupon.porcentaje) / 100) };
  }

  private formatearFecha(fecha: string): string {
    const [anio, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${anio}`;
  }

  private fechaLocalHoy(): string {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${hoy.getFullYear()}-${mes}-${dia}`;
  }
}
