import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Homecomponent } from './components/homecomponent/homecomponent';
import { Listadocomponent } from './components/listadocomponent/listadocomponent';
import { Detallecomponent } from './components/detallecomponent/detallecomponent';
import { Misreservascomponent } from './components/misreservascomponent/misreservascomponent';
import { Logincomponent } from './components/logincomponent/logincomponent';
import { Registrocomponent } from './components/registrocomponent/registrocomponent';

const routes: Routes = [
  {
    path: '',
    component: Homecomponent,
    title: 'Nocturna Stays — Inicio',
  },
  {
    path: 'listado',
    component: Listadocomponent,
    title: 'Nocturna Stays — Listado de alojamientos',
  },
  {
    path: 'alojamientos/:id',
    component: Detallecomponent,
    title: 'Nocturna Stays — Detalle del alojamiento',
  },
  {
    path: 'mis-reservas',
    component: Misreservascomponent,
    title: 'Nocturna Stays — Mis reservas',
  },
  {
    path: 'login',
    component: Logincomponent,
    title: 'Nocturna Stays — Iniciar sesión',
  },
  {
    path: 'registro',
    component: Registrocomponent,
    title: 'Nocturna Stays — Crear cuenta',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
