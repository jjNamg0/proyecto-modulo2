import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Homecomponent } from './components/homecomponent/homecomponent';
import { Listadocomponent } from './components/listadocomponent/listadocomponent';
import { Detallecomponent } from './components/detallecomponent/detallecomponent';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
