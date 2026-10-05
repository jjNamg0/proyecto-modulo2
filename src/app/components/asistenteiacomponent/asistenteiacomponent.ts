import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Alojamientosservice, Alojamiento } from '../../services/alojamientosservice';
import { Geminiservice } from '../../services/geminiservice';
@Component({
  selector: 'app-asistenteiacomponent',
  standalone: true,
  imports: [FormsModule,RouterLink],
  templateUrl: './asistenteiacomponent.html',
  styleUrl: './asistenteiacomponent.css',
})
export class Asistenteiacomponent {

  pregunta = '';

  mensajes: {
    tipo: string;
    texto: string;

    resultados?: Alojamiento[];
  }[] = [
    {
      tipo: 'ia',
      texto: '¡Hola!  Soy el asistente de Nocturna Stays. Pregúntame si tenemos alojamientos en una ciudad o lugar.'
    }
  ];

  constructor(
    private alojamientosService: Alojamientosservice,
    private geminiService: Geminiservice
  ) {}

  async preguntar() {
    if (this.pregunta.trim() === '') return;

    const preguntaUsuario = this.pregunta.trim();

    this.mensajes.push({
      tipo: 'usuario',
      texto: preguntaUsuario
    });

    this.pregunta = '';

    this.mensajes.push({
      tipo: 'ia',
      texto: ' Buscando alojamientos...'
    });

    try {
      const filtros = await this.geminiService.interpretarPregunta(
        preguntaUsuario
      );

      console.log('FILTROS DE GEMINI:', filtros);

      this.alojamientosService.obtenerAlojamientos().subscribe({
        next: (alojamientos) => {

          const resultados = alojamientos.filter((alojamiento) => {

            const coincideCiudad =
              !filtros.ciudad ||
              this.normalizar(alojamiento.ciudad)
                .includes(this.normalizar(filtros.ciudad));

            const coincidePais =
              !filtros.pais ||
              this.normalizar(alojamiento.pais)
                .includes(this.normalizar(filtros.pais));

            const coincideUbicacion =
              !filtros.ubicacion ||
              this.normalizar(alojamiento.ubicacion)
                .includes(this.normalizar(filtros.ubicacion));

            const coincideTipo =
              !filtros.tipo ||
              this.normalizar(alojamiento.tipo)
                .includes(this.normalizar(filtros.tipo));
            const coincideHuespedes =
              !filtros.huespedes ||
              alojamiento.capacidad >= filtros.huespedes;

            const coincidePrecio =
              !filtros.precioMaximo ||
              alojamiento.precioNoche <= filtros.precioMaximo;

            return (
              coincideCiudad &&
              coincidePais &&
              coincideUbicacion &&
              coincideTipo &&
              coincideHuespedes &&
              coincidePrecio
            );
          });

          let respuesta = '';

          if (resultados.length > 0) {

            respuesta =
              ` Sí, encontré ${resultados.length} alojamiento(s) que coinciden con tu búsqueda.\n\n`;

            resultados.slice(0, 5).forEach((alojamiento) => {

              respuesta += ` ${alojamiento.nombre}\n`;
              respuesta += ` ${alojamiento.ciudad}, ${alojamiento.pais}\n`;
              respuesta += `${alojamiento.tipo}\n`;
              respuesta += ` ${alojamiento.precioNoche.toLocaleString('es-CO')} por noche\n\n`;
            });

          } else {

            respuesta =
              ' No encontré alojamientos que coincidan con tu búsqueda. Prueba con otra ciudad, país, ubicación o tipo de alojamiento.';

          }

          this.mensajes[this.mensajes.length - 1] = {
            tipo: 'ia',
            texto: respuesta,
            resultados: resultados.slice(0, 5)
          };
        },

        error: (error) => {

          console.error('ERROR ALOJAMIENTOS:', error);

          this.mensajes[this.mensajes.length - 1] = {
            tipo: 'ia',
            texto: ' No pude consultar los alojamientos.'
          };

        }
      });

    } catch (error) {

      console.error('ERROR GEMINI:', error);

      this.mensajes[this.mensajes.length - 1] = {
        tipo: 'ia',
        texto: ' No pude interpretar tu pregunta.'
      };
    }
  }


  private buscarAlojamientos(
    pregunta: string,
    alojamientos: Alojamiento[]
  ): Alojamiento[] {

    const texto = this.normalizar(pregunta);

    return alojamientos.filter((alojamiento) => {

      const ciudad = this.normalizar(alojamiento.ciudad);
      const pais = this.normalizar(alojamiento.pais);
      const ubicacion = this.normalizar(alojamiento.ubicacion);
      const tipo = this.normalizar(alojamiento.tipo);
      const nombre = this.normalizar(alojamiento.nombre);

      return (
        texto.includes(ciudad) ||
        texto.includes(pais) ||
        texto.includes(ubicacion) ||
        texto.includes(tipo) ||
        texto.includes(nombre)
      );

    });
  }

  private normalizar(texto: string): string {

    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  }
}
