import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Homecomponent } from './components/homecomponent/homecomponent';
import { Listadocomponent } from './components/listadocomponent/listadocomponent';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
