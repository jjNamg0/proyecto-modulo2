import { NgModule, inject } from '@angular/core';
import { CanActivateFn, RouterModule, Routes } from '@angular/router';
import { Homecomponent } from './components/homecomponent/homecomponent';
import { Listadocomponent } from './components/listadocomponent/listadocomponent';
import { Detallecomponent } from './components/detallecomponent/detallecomponent';
import { Misreservascomponent } from './components/misreservascomponent/misreservascomponent';
import { Logincomponent } from './components/logincomponent/logincomponent';
import { Registrocomponent } from './components/registrocomponent/registrocomponent';
import { Favoritoscomponent } from './components/favoritoscomponent/favoritoscomponent';
import { Notfoundcomponent } from './components/notfoundcomponent/notfoundcomponent';
import { Publicarcomponent } from './components/publicarcomponent/publicarcomponent';
import { Perfilcomponent } from './components/perfilcomponent/perfilcomponent';
import { Terminoscomponent } from './components/terminoscomponent/terminoscomponent';
import { Privacidadcomponent } from './components/privacidadcomponent/privacidadcomponent';
import { Authguardservice } from './services/authguardservice';

const requiereSesion: CanActivateFn = (_ruta, estado) => inject(Authguardservice).verificarSesion(estado.url);

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
    canActivate: [requiereSesion],
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
  {
    path: 'favoritos',
    component: Favoritoscomponent,
    canActivate: [requiereSesion],
    title: 'Nocturna Stays — Favoritos',
  },
  {
    path: 'publicar',
    component: Publicarcomponent,
    canActivate: [requiereSesion],
    title: 'Nocturna Stays — Publicar alojamiento',
  },
  {
    path: 'publicar/:id',
    component: Publicarcomponent,
    canActivate: [requiereSesion],
    title: 'Nocturna Stays — Editar alojamiento',
  },
  {
    path: 'perfil',
    component: Perfilcomponent,
    canActivate: [requiereSesion],
    title: 'Nocturna Stays — Mi perfil',
  },
  {
    path: '**',
    component: Notfoundcomponent,
    title: 'Nocturna Stays — Página no encontrada',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
