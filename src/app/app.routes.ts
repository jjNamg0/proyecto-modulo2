import { Routes } from '@angular/router';
import {Asistenteiacomponent} from './components/asistenteiacomponent/asistenteiacomponent';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/homecomponent/homecomponent').then((m) => m.Homecomponent),
    title: 'Nocturna Stays — Inicio',
  },
  {
    path:"asistente-ia",
    component: Asistenteiacomponent,
  }
];
