import { Component, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Comparadorservice } from '../../services/comparadorservice';

@Component({
  selector: 'app-comparadorbarracomponent',
  standalone: false,
  styleUrl: './comparadorbarracomponent.css',
  templateUrl: './comparadorbarracomponent.html',
})
export class Comparadorbarracomponent implements OnInit {
  rutaActual = signal('');

  constructor(
    private comparadorService: Comparadorservice,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.rutaActual.set(this.router.url);
    this.router.events
      .pipe(filter((evento) => evento instanceof NavigationEnd))
      .subscribe((evento) => this.rutaActual.set(evento.urlAfterRedirects));
  }

  cantidad(): number {
    return this.comparadorService.cantidad();
  }

  maximo(): number {
    return this.comparadorService.MAXIMO;
  }

  visible(): boolean {
    return this.cantidad() > 0 && !this.rutaActual().startsWith('/comparar');
  }

  limpiar(): void {
    this.comparadorService.limpiar();
  }
}
