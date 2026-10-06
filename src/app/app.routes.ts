import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/homecomponent/homecomponent').then((m) => m.Homecomponent),
    title: 'Nocturna Stays — Inicio',
  },
];
